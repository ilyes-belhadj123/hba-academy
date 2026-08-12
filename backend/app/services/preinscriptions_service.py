from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

from app.core.errors import AppError
from app.models.preinscription import PreinscriptionIn
from app.services.email_service import send_email


async def _reserve_place(db: AsyncIOMotorDatabase, session_id: str) -> dict:
    try:
        object_id = ObjectId(session_id)
    except InvalidId:
        raise AppError("Session introuvable", status_code=status.HTTP_404_NOT_FOUND)

    session = await db.sessions.find_one({"_id": object_id})
    if session is None:
        raise AppError("Session introuvable", status_code=status.HTTP_404_NOT_FOUND)

    updated_session = await db.sessions.find_one_and_update(
        {"_id": object_id, "$expr": {"$lt": ["$places_prises", "$capacite_max"]}},
        {"$inc": {"places_prises": 1}},
        return_document=ReturnDocument.AFTER,
    )
    if updated_session is None:
        raise AppError("Cette session est complète", status_code=status.HTTP_409_CONFLICT)

    return updated_session


async def create_preinscription(
    db: AsyncIOMotorDatabase, payload: PreinscriptionIn, source: str = "vitrine"
) -> dict:
    if payload.mineur and not payload.consentement_parental:
        raise AppError(
            "Le consentement parental est obligatoire pour un participant mineur",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    session = await _reserve_place(db, payload.session_id)

    lead = {
        "source": source,
        "coordonnees": {"nom": payload.nom, "email": payload.email, "telephone": payload.telephone},
        "formation_interet": session["formation_id"],
        "statut": "converti",
        "historique": [],
    }
    lead_result = await db.leads.insert_one(lead)

    preinscription = {
        "lead_id": str(lead_result.inserted_id),
        "session_id": payload.session_id,
        "statut": "en_attente",
        "date_creation": datetime.now(timezone.utc),
    }
    result = await db.preinscriptions.insert_one(preinscription)
    preinscription["_id"] = str(result.inserted_id)

    send_email(
        to=payload.email,
        subject="Confirmation de votre préinscription — HBA Academy",
        body=(
            f"Bonjour {payload.nom},\n\n"
            "Nous avons bien reçu votre préinscription. Notre équipe vous contactera "
            "prochainement pour finaliser votre inscription.\n\nHBA Academy"
        ),
    )

    return preinscription
