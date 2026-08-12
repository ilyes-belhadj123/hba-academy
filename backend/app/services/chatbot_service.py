import json
import logging
from datetime import datetime, timezone

import requests
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.models.chatbot import ChatMessage
from app.models.preinscription import PreinscriptionIn
from app.services import preinscriptions_service
from app.services.ai_utils import extract_json_from_content
from app.services.email_service import send_email

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Tu es un conseiller commercial pour HBA Academy, un centre de formation \
multi-filières (langues, bureautique/informatique, développement personnel/coaching, \
robotique et programmation IA pour les jeunes).

Ton rôle : répondre aux questions sur les formations, tarifs, sessions, prérequis et le \
processus d'inscription. Réponds en français si le visiteur écrit en français, et en Derja \
tunisien (dialecte tunisien, transcrit en alphabet latin) si le visiteur écrit en Derja. \
Ton toujours professionnel, chaleureux et concis.

Périmètre STRICT : tu ne réponds QU'aux questions concernant HBA Academy (formations, \
tarifs, sessions, prérequis, inscription). Pour toute question hors de ce périmètre \
(actualité, autres sujets, demandes personnelles non liées), refuse poliment et indique que \
tu peux transmettre la demande à un conseiller humain.

Tu reçois en contexte le catalogue actif des formations et leurs sessions à venir (JSON). \
Ne mentionne JAMAIS de formation, tarif ou session qui ne figure pas dans ce catalogue.

Au fil de la conversation, extrais discrètement les informations de qualification \
disponibles (filière d'intérêt, disponibilité, budget) et les coordonnées si le visiteur \
les donne spontanément (nom, email, téléphone), pour préparer une éventuelle préinscription. \
S'il exprime clairement le souhait de s'inscrire ou réserver une place, signale-le.

Réponds STRICTEMENT en JSON, sans aucun texte autour, avec exactement ce format :
{"reponse": "<ta réponse au visiteur>", "langue": "fr" ou "derja", \
"hors_perimetre": true/false, "souhaite_reserver": true/false, \
"demande_conseiller_humain": true/false, \
"qualification": {"filiere_interet": "<ou null>", "disponibilite": "<ou null>", \
"budget": "<ou null>", "nom": "<ou null>", "email": "<ou null>", "telephone": "<ou null>"}}
"""

ESCALADE_KEYWORDS = ["conseiller", "humain", "parler à quelqu'un", "un responsable", "urgent"]

QUALIFICATION_FIELDS = ["filiere_interet", "disponibilite", "budget", "nom", "email", "telephone"]

MINEUR_AGE_THRESHOLD = 16


async def _get_context(db: AsyncIOMotorDatabase) -> dict:
    formations = await db.formations.find({}).to_list(length=None)
    sessions = await db.sessions.find({}).to_list(length=None)

    formations_summary = [
        {
            "id": str(f["_id"]),
            "titre": f["titre"],
            "filiere": f["filiere"],
            "niveau": f["niveau"],
            "mode": f["mode"],
            "prix": f["prix"],
            "duree": f["duree"],
            "age_min": f["age_min"],
            "age_max": f["age_max"],
        }
        for f in formations
    ]
    sessions_summary = [
        {
            "formation_id": s["formation_id"],
            "date_debut": s["date_debut"].isoformat(),
            "places_restantes": max(s["capacite_max"] - s["places_prises"], 0),
        }
        for s in sessions
    ]
    return {"formations": formations_summary, "sessions": sessions_summary}


def _call_ai(messages: list[ChatMessage], context: dict) -> dict:
    settings = get_settings()
    if not settings.openrouter_api_key:
        raise RuntimeError("OPENROUTER_API_KEY non configurée")

    api_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "system",
            "content": f"Contexte catalogue et sessions (JSON) : {json.dumps(context, ensure_ascii=False)}",
        },
    ] + [{"role": m.role, "content": m.content} for m in messages]

    response = requests.post(
        f"{settings.openrouter_base_url}/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.openrouter_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": settings.openrouter_model,
            "messages": api_messages,
            "response_format": {"type": "json_object"},
            "temperature": 0.4,
        },
        timeout=20,
    )
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    return extract_json_from_content(content)


def _fallback_response() -> dict:
    return {
        "reponse": (
            "Désolé, je rencontre une difficulté technique en ce moment. "
            "Un conseiller va prendre le relais et vous répondre au plus vite."
        ),
        "langue": "fr",
        "hors_perimetre": False,
        "souhaite_reserver": False,
        "demande_conseiller_humain": True,
        "qualification": {field: None for field in QUALIFICATION_FIELDS},
    }


def _merge_qualification(existing: dict, extracted: dict) -> dict:
    merged = dict(existing)
    for field in QUALIFICATION_FIELDS:
        value = extracted.get(field)
        if value:
            merged[field] = value
    return merged


def _has_escalade_keyword(messages: list[ChatMessage]) -> bool:
    if not messages:
        return False
    last_user_message = next((m.content.lower() for m in reversed(messages) if m.role == "user"), "")
    return any(keyword in last_user_message for keyword in ESCALADE_KEYWORDS)


async def _notify_team(session_id: str, messages: list[ChatMessage], qualification: dict) -> None:
    transcript = "\n".join(f"{m.role}: {m.content}" for m in messages)
    settings = get_settings()
    send_email(
        to=settings.team_notification_email,
        subject=f"Escalade chatbot — session {session_id}",
        body=(
            f"Une conversation du chatbot nécessite l'intervention d'un conseiller.\n\n"
            f"Qualification connue : {json.dumps(qualification, ensure_ascii=False)}\n\n"
            f"Historique complet :\n{transcript}"
        ),
    )


async def _try_auto_preinscription(
    db: AsyncIOMotorDatabase, qualification: dict
) -> tuple[str | None, str | None]:
    required = ["filiere_interet", "nom", "email", "telephone"]
    if not all(qualification.get(field) for field in required):
        return None, None

    formation = await db.formations.find_one({"filiere": qualification["filiere_interet"]})
    if formation is None or formation["age_min"] < MINEUR_AGE_THRESHOLD:
        return None, None

    session = await db.sessions.find_one(
        {
            "formation_id": str(formation["_id"]),
            "$expr": {"$lt": ["$places_prises", "$capacite_max"]},
        },
        sort=[("date_debut", 1)],
    )
    if session is None:
        return None, None

    try:
        preinscription = await preinscriptions_service.create_preinscription(
            db,
            PreinscriptionIn(
                session_id=str(session["_id"]),
                nom=qualification["nom"],
                email=qualification["email"],
                telephone=qualification["telephone"],
                mineur=False,
                consentement_parental=False,
            ),
            source="chatbot",
        )
    except Exception as error:
        logger.warning("Échec de la préinscription automatique via chatbot : %s", error)
        return None, None

    return preinscription["_id"], preinscription["lead_id"]


async def handle_message(db: AsyncIOMotorDatabase, session_id: str, messages: list[ChatMessage]) -> dict:
    conversation = await db.conversations_chatbot.find_one({"session_id": session_id}) or {}
    qualification = conversation.get("qualification", {field: None for field in QUALIFICATION_FIELDS})
    already_escalade = conversation.get("statut_escalade", False)
    preinscription_id = conversation.get("preinscription_id")

    context = await _get_context(db)

    try:
        result = _call_ai(messages, context)
    except Exception as error:
        logger.warning("Échec de l'appel IA chatbot (%s), réponse de repli utilisée", error)
        result = _fallback_response()

    qualification = _merge_qualification(qualification, result.get("qualification") or {})

    escalade = bool(result.get("demande_conseiller_humain")) or _has_escalade_keyword(messages)
    if escalade and not already_escalade:
        await _notify_team(session_id, messages, qualification)

    preinscription_confirmee = False
    reponse_text = result["reponse"]

    if result.get("souhaite_reserver") and not preinscription_id:
        new_preinscription_id, lead_id = await _try_auto_preinscription(db, qualification)
        if new_preinscription_id:
            preinscription_id = new_preinscription_id
            preinscription_confirmee = True
            reponse_text += (
                "\n\nVotre préinscription a bien été enregistrée, vous recevrez un email de "
                "confirmation avec tous les détails."
            )
            conversation["lead_id"] = lead_id

    await db.conversations_chatbot.update_one(
        {"session_id": session_id},
        {
            "$set": {
                "session_id": session_id,
                "historique_messages": [m.model_dump() for m in messages]
                + [{"role": "assistant", "content": reponse_text}],
                "langue": result.get("langue", "fr"),
                "statut_escalade": escalade or already_escalade,
                "qualification": qualification,
                "preinscription_id": preinscription_id,
                "lead_id": conversation.get("lead_id"),
                "updated_at": datetime.now(timezone.utc),
            }
        },
        upsert=True,
    )

    return {
        "message": reponse_text,
        "langue": result.get("langue", "fr"),
        "escalade": escalade or already_escalade,
        "preinscription_confirmee": preinscription_confirmee,
    }
