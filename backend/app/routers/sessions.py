from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.mongodb import get_db
from app.models.session import SessionOut
from app.services import sessions_service

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("", response_model=list[SessionOut])
async def get_sessions(formation_id: str | None = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await sessions_service.list_sessions(db, formation_id=formation_id)
