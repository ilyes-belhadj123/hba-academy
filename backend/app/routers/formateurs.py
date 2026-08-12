from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.errors import AppError
from app.db.mongodb import get_db
from app.models.formateur import FormateurOut
from app.services import formateurs_service

router = APIRouter(prefix="/formateurs", tags=["formateurs"])


@router.get("", response_model=list[FormateurOut])
async def get_formateurs(
    filiere: str | None = None,
    formation_id: str | None = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await formateurs_service.list_formateurs(db, filiere=filiere, formation_id=formation_id)


@router.get("/{formateur_id}", response_model=FormateurOut)
async def get_formateur(formateur_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    formateur = await formateurs_service.get_formateur_by_id(db, formateur_id)
    if formateur is None:
        raise AppError("Formateur introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return formateur
