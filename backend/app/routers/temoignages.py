from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.mongodb import get_db
from app.models.temoignage import TemoignageOut
from app.services import temoignages_service

router = APIRouter(prefix="/temoignages", tags=["temoignages"])


@router.get("", response_model=list[TemoignageOut])
async def get_temoignages(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await temoignages_service.list_all_temoignages_publies(db)
