from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.errors import AppError
from app.db.mongodb import get_db
from app.models.formation import FormationOut
from app.models.temoignage import TemoignageOut
from app.services import formations_service, temoignages_service

router = APIRouter(prefix="/formations", tags=["formations"])


@router.get("/filieres", response_model=list[str])
async def get_filieres(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await formations_service.list_filieres(db)


@router.get("", response_model=list[FormationOut])
async def get_formations(
    filiere: str | None = None,
    age: int | None = None,
    duree: str | None = None,
    prix_max: float | None = None,
    niveau: str | None = None,
    mode: str | None = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await formations_service.list_formations(
        db, filiere=filiere, age=age, duree=duree, prix_max=prix_max, niveau=niveau, mode=mode
    )


@router.get("/{formation_id}", response_model=FormationOut)
async def get_formation(formation_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    formation = await formations_service.get_formation_by_id(db, formation_id)
    if formation is None:
        raise AppError("Formation introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return formation


@router.get("/{formation_id}/temoignages", response_model=list[TemoignageOut])
async def get_formation_temoignages(formation_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await temoignages_service.list_temoignages_publies(db, formation_id)
