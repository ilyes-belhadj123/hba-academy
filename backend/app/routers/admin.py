from fastapi import APIRouter, Depends, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import require_roles
from app.core.errors import AppError
from app.db.mongodb import get_db
from app.models.formateur import FormateurIn, FormateurOut, FormateurUpdate
from app.models.formation import FormationIn, FormationOut, FormationUpdate
from app.models.realisation import RealisationIn, RealisationOut, RealisationUpdate
from app.models.session import SessionIn, SessionOut, SessionUpdate
from app.models.temoignage import TemoignageIn, TemoignageOut, TemoignageUpdate
from app.services import (
    formateurs_service,
    formations_service,
    realisations_service,
    sessions_service,
    temoignages_service,
)
from app.services.storage_service import compress_image_if_needed, get_storage

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


@router.post("/medias", status_code=status.HTTP_201_CREATED)
async def upload_media(file: UploadFile):
    if not file.content_type or not (file.content_type.startswith("image/") or file.content_type.startswith("video/")):
        raise AppError("Seuls les fichiers image ou vidéo sont acceptés", status_code=status.HTTP_400_BAD_REQUEST)

    content = await file.read()
    content = compress_image_if_needed(content, file.content_type)

    storage = get_storage()
    url = await storage.save(content, file.filename or "media", file.content_type)
    return {"url": url}


@router.get("/temoignages", response_model=list[TemoignageOut])
async def list_temoignages(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await temoignages_service.list_all_temoignages(db)


@router.post("/temoignages", response_model=TemoignageOut, status_code=status.HTTP_201_CREATED)
async def create_temoignage(payload: TemoignageIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await temoignages_service.create_temoignage(db, payload)


@router.put("/temoignages/{temoignage_id}", response_model=TemoignageOut)
async def update_temoignage(
    temoignage_id: str, payload: TemoignageUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
):
    temoignage = await temoignages_service.update_temoignage(db, temoignage_id, payload)
    if temoignage is None:
        raise AppError("Témoignage introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return temoignage


@router.delete("/temoignages/{temoignage_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_temoignage(temoignage_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    deleted = await temoignages_service.delete_temoignage(db, temoignage_id)
    if not deleted:
        raise AppError("Témoignage introuvable", status_code=status.HTTP_404_NOT_FOUND)


@router.post("/formateurs", response_model=FormateurOut, status_code=status.HTTP_201_CREATED)
async def create_formateur(payload: FormateurIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await formateurs_service.create_formateur(db, payload)


@router.put("/formateurs/{formateur_id}", response_model=FormateurOut)
async def update_formateur(
    formateur_id: str, payload: FormateurUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
):
    formateur = await formateurs_service.update_formateur(db, formateur_id, payload)
    if formateur is None:
        raise AppError("Formateur introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return formateur


@router.delete("/formateurs/{formateur_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_formateur(formateur_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    deleted = await formateurs_service.delete_formateur(db, formateur_id)
    if not deleted:
        raise AppError("Formateur introuvable", status_code=status.HTTP_404_NOT_FOUND)


@router.get("/realisations", response_model=list[RealisationOut])
async def list_realisations(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await realisations_service.list_all_realisations(db)


@router.post("/realisations", response_model=RealisationOut, status_code=status.HTTP_201_CREATED)
async def create_realisation(payload: RealisationIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await realisations_service.create_realisation(db, payload)


@router.put("/realisations/{realisation_id}", response_model=RealisationOut)
async def update_realisation(
    realisation_id: str, payload: RealisationUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
):
    realisation = await realisations_service.update_realisation(db, realisation_id, payload)
    if realisation is None:
        raise AppError("Réalisation introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return realisation


@router.delete("/realisations/{realisation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_realisation(realisation_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    deleted = await realisations_service.delete_realisation(db, realisation_id)
    if not deleted:
        raise AppError("Réalisation introuvable", status_code=status.HTTP_404_NOT_FOUND)
