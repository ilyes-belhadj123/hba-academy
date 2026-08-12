from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.mongodb import get_db
from app.models.preinscription import PreinscriptionIn, PreinscriptionOut
from app.services import preinscriptions_service

router = APIRouter(prefix="/preinscriptions", tags=["preinscriptions"])


@router.post("", response_model=PreinscriptionOut, status_code=status.HTTP_201_CREATED)
async def create_preinscription(payload: PreinscriptionIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await preinscriptions_service.create_preinscription(db, payload)
