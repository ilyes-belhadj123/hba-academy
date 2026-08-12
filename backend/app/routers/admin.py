from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import require_roles
from app.core.errors import AppError
from app.db.mongodb import get_db
from app.models.formation import FormationIn, FormationOut, FormationUpdate
from app.models.session import SessionIn, SessionOut, SessionUpdate
from app.services import formations_service, sessions_service

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_roles("admin", "formateur"))],
)


@router.post("/formations", response_model=FormationOut, status_code=status.HTTP_201_CREATED)
async def create_formation(payload: FormationIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await formations_service.create_formation(db, payload)


@router.put("/formations/{formation_id}", response_model=FormationOut)
async def update_formation(
    formation_id: str, payload: FormationUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
):
    formation = await formations_service.update_formation(db, formation_id, payload)
    if formation is None:
        raise AppError("Formation introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return formation


@router.delete("/formations/{formation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_formation(formation_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    deleted = await formations_service.delete_formation(db, formation_id)
    if not deleted:
        raise AppError("Formation introuvable", status_code=status.HTTP_404_NOT_FOUND)


@router.post("/sessions", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
async def create_session(payload: SessionIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await sessions_service.create_session(db, payload)


@router.put("/sessions/{session_id}", response_model=SessionOut)
async def update_session(session_id: str, payload: SessionUpdate, db: AsyncIOMotorDatabase = Depends(get_db)):
    session = await sessions_service.update_session(db, session_id, payload)
    if session is None:
        raise AppError("Session introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return session


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(session_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    deleted = await sessions_service.delete_session(db, session_id)
    if not deleted:
        raise AppError("Session introuvable", status_code=status.HTTP_404_NOT_FOUND)
