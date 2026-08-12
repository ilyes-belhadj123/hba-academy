from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.errors import AppError
from app.db.mongodb import get_db
from app.models.orientation import EnvoyerResultatIn, OrientationReponses, RecommandationOut
from app.services import formations_service, orientation_service
from app.services.email_service import send_email

router = APIRouter(prefix="/orientation", tags=["orientation"])


@router.post("/recommander", response_model=RecommandationOut)
async def recommander(payload: OrientationReponses, db: AsyncIOMotorDatabase = Depends(get_db)):
    resultat = await orientation_service.get_recommandation(db, payload)

    formation_principale = await formations_service.get_formation_by_id(
        db, resultat["formation_principale_id"]
    )
    if formation_principale is None:
        raise AppError(
            "Aucune formation disponible pour établir une recommandation",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    alternatives = []
    for alt_id in resultat["alternatives_ids"]:
        alternative = await formations_service.get_formation_by_id(db, alt_id)
        if alternative:
            alternatives.append(alternative)

    return RecommandationOut(
        formation_principale=formation_principale,
        alternatives=alternatives,
        justification=resultat["justification"],
        source=resultat["source"],
    )


@router.post("/envoyer-email", status_code=status.HTTP_204_NO_CONTENT)
async def envoyer_email(payload: EnvoyerResultatIn):
    send_email(
        to=payload.email,
        subject="Votre recommandation de formation — HBA Academy",
        body=(
            f"Bonjour,\n\nVoici le résultat de votre simulation d'orientation :\n\n"
            f"{payload.justification}\n\nDécouvrez la formation recommandée sur notre site.\n\n"
            "HBA Academy"
        ),
    )
