import json
import logging
from datetime import datetime, timezone

import requests
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.models.orientation import OrientationReponses
from app.services.ai_utils import extract_json_from_content

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Tu es un conseiller en orientation pour HBA Academy, un centre de formation \
multi-filières (langues, bureautique/informatique, développement personnel/coaching, robotique \
et programmation IA pour les jeunes).

On te donne le catalogue actif des formations (JSON) et les réponses d'un visiteur à un \
questionnaire d'orientation. Tu dois recommander UNE formation principale et jusqu'à 2 \
formations alternatives, en choisissant UNIQUEMENT parmi les formations du catalogue fourni \
(jamais une formation qui n'y figure pas).

Réponds STRICTEMENT en JSON, sans texte autour, avec exactement ce format :
{"formation_principale_id": "<id du catalogue>", "alternatives_ids": ["<id>", "<id>"], \
"justification": "<2-3 phrases expliquant le choix, en français>"}
"""


async def _get_catalogue_summary(db: AsyncIOMotorDatabase) -> list[dict]:
    cursor = db.formations.find({})
    formations = await cursor.to_list(length=None)
    return [
        {
            "id": str(formation["_id"]),
            "titre": formation["titre"],
            "filiere": formation["filiere"],
            "niveau": formation["niveau"],
            "mode": formation["mode"],
            "age_min": formation["age_min"],
            "age_max": formation["age_max"],
            "description": formation["description"],
        }
        for formation in formations
    ]


def _call_openrouter(reponses: OrientationReponses, catalogue: list[dict]) -> dict:
    settings = get_settings()
    if not settings.openrouter_api_key:
        raise RuntimeError("OPENROUTER_API_KEY non configurée")

    user_message = json.dumps(
        {"catalogue": catalogue, "reponses": reponses.model_dump()},
        ensure_ascii=False,
    )

    response = requests.post(
        f"{settings.openrouter_base_url}/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.openrouter_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": settings.openrouter_model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3,
        },
        timeout=20,
    )
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    return extract_json_from_content(content)


def _fallback_recommendation(reponses: OrientationReponses, catalogue: list[dict]) -> dict:
    def score(formation: dict) -> int:
        points = 0
        if formation["filiere"] == reponses.filiere_cible:
            points += 3
        if formation["niveau"] == reponses.niveau:
            points += 1
        if reponses.mode == "peu_importe" or formation["mode"] == reponses.mode:
            points += 1
        if reponses.age is not None and formation["age_min"] <= reponses.age <= formation["age_max"]:
            points += 2
        return points

    classees = sorted(catalogue, key=score, reverse=True)
    if not classees:
        raise ValueError("Catalogue vide, aucune recommandation possible")

    principale = classees[0]
    alternatives = classees[1:3]

    return {
        "formation_principale_id": principale["id"],
        "alternatives_ids": [f["id"] for f in alternatives],
        "justification": (
            f"Recommandation basée sur votre intérêt pour « {reponses.filiere_cible} » "
            f"et votre niveau {reponses.niveau}."
        ),
    }


def _valid_ids(raw: dict, catalogue_ids: set[str]) -> bool:
    if raw.get("formation_principale_id") not in catalogue_ids:
        return False
    return all(alt_id in catalogue_ids for alt_id in raw.get("alternatives_ids", []))


async def _log_simulation(
    db: AsyncIOMotorDatabase, reponses: OrientationReponses, raw: dict, source: str
) -> None:
    await db.simulateur_logs.insert_one(
        {
            "reponses": reponses.model_dump(),
            "recommandation": raw,
            "source": source,
            "timestamp": datetime.now(timezone.utc),
        }
    )


async def get_recommandation(db: AsyncIOMotorDatabase, reponses: OrientationReponses) -> dict:
    catalogue = await _get_catalogue_summary(db)
    catalogue_ids = {formation["id"] for formation in catalogue}

    raw: dict | None = None
    source = "regles"

    try:
        candidate = _call_openrouter(reponses, catalogue)
        if _valid_ids(candidate, catalogue_ids):
            raw = candidate
            source = "ia"
        else:
            logger.warning("Recommandation IA hors catalogue, bascule sur le fallback par règles")
    except Exception as error:
        logger.warning("Échec de l'appel IA (%s), bascule sur le fallback par règles", error)

    if raw is None:
        raw = _fallback_recommendation(reponses, catalogue)

    await _log_simulation(db, reponses, raw, source)

    formations_by_id = {f["id"]: f for f in catalogue}
    return {
        "formation_principale_id": raw["formation_principale_id"],
        "alternatives_ids": [
            alt_id for alt_id in raw.get("alternatives_ids", []) if alt_id in formations_by_id
        ],
        "justification": raw["justification"],
        "source": source,
    }
