from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.mongodb import get_db
from app.models.realisation import RealisationOut
from app.services import realisations_service

router = APIRouter(prefix="/realisations", tags=["realisations"])


@router.get("/chiffres-cles", response_model=list[RealisationOut])
async def get_chiffres_cles(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await realisations_service.list_realisations(db, type_="chiffre_cle")


@router.get("", response_model=list[RealisationOut])
async def get_realisations(
    type: str | None = None,
    mise_en_avant: bool | None = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await realisations_service.list_realisations(db, type_=type, mise_en_avant=mise_en_avant)
