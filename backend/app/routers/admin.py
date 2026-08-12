from datetime import datetime

from fastapi import APIRouter, Depends, Response, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import require_roles
from app.core.errors import AppError
from app.db.mongodb import get_db
from app.models.apprenant import ApprenantIn, ApprenantOut, EnrollIn
from app.models.document import DocumentOut
from app.models.formateur import FormateurIn, FormateurOut, FormateurUpdate
from app.models.formation import FormationIn, FormationOut, FormationUpdate
from app.models.lead import LeadOut, LeadUpdateIn
from app.models.realisation import RealisationIn, RealisationOut, RealisationUpdate
from app.models.session import SessionIn, SessionOut, SessionUpdate
from app.models.stats import StatsOut
from app.models.temoignage import TemoignageIn, TemoignageOut, TemoignageUpdate
from app.services import (
    apprenants_service,
    documents_service,
    formateurs_service,
    formations_service,
    leads_service,
    realisations_service,
    sessions_service,
    stats_service,
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


@router.get("/apprenants", response_model=list[ApprenantOut])
async def list_apprenants(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await apprenants_service.list_apprenants(db)


@router.post("/apprenants", response_model=ApprenantOut, status_code=status.HTTP_201_CREATED)
async def create_apprenant(payload: ApprenantIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await apprenants_service.create_apprenant(db, payload)


@router.post("/apprenants/{apprenant_id}/formations", response_model=ApprenantOut)
async def enroll_apprenant(
    apprenant_id: str, payload: EnrollIn, db: AsyncIOMotorDatabase = Depends(get_db)
):
    apprenant = await apprenants_service.enroll(db, apprenant_id, payload)
    if apprenant is None:
        raise AppError("Apprenant introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return apprenant


@router.post(
    "/apprenants/{apprenant_id}/documents", response_model=DocumentOut, status_code=status.HTTP_201_CREATED
)
async def upload_document(
    apprenant_id: str,
    titre: str,
    file: UploadFile,
    formation_id: str | None = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    content = await file.read()
    storage = get_storage()
    storage_url = await storage.save(content, file.filename or "document", file.content_type or "application/octet-stream")
    return await documents_service.create_document(db, apprenant_id, titre, storage_url, formation_id)


@router.get("/leads", response_model=list[LeadOut])
async def list_leads(
    source: str | None = None, statut: str | None = None, db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await leads_service.list_leads(db, source=source, statut=statut)


@router.get("/leads/export")
async def export_leads(db: AsyncIOMotorDatabase = Depends(get_db)):
    csv_content = await leads_service.export_leads_csv(db)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads.csv"},
    )


@router.patch("/leads/{lead_id}", response_model=LeadOut)
async def update_lead(lead_id: str, payload: LeadUpdateIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    lead = await leads_service.update_lead_statut(db, lead_id, payload.statut)
    if lead is None:
        raise AppError("Lead introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return lead


@router.get("/stats", response_model=StatsOut)
async def get_stats(
    date_debut: datetime | None = None,
    date_fin: datetime | None = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await stats_service.get_stats(db, date_debut=date_debut, date_fin=date_fin)
