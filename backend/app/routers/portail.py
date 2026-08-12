from fastapi import APIRouter, Depends, status
from fastapi.responses import RedirectResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import CurrentUser, require_roles
from app.core.errors import AppError
from app.core.security import decode_download_token
from app.db.mongodb import get_db
from app.models.document import DocumentOut
from app.models.portail import PlanningItem
from app.services import apprenants_service, certificats_service, documents_service, portail_service

router = APIRouter(prefix="/portail", tags=["portail"])


@router.get("/planning", response_model=list[PlanningItem])
async def get_planning(
    current_user: CurrentUser = Depends(require_roles("apprenant")),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    apprenant = await apprenants_service.get_apprenant_by_id(db, current_user.id)
    if apprenant is None:
        raise AppError("Apprenant introuvable", status_code=status.HTTP_404_NOT_FOUND)
    return await portail_service.get_planning(db, apprenant)


@router.get("/documents", response_model=list[DocumentOut])
async def get_documents(
    current_user: CurrentUser = Depends(require_roles("apprenant")),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await documents_service.list_documents_for_apprenant(db, current_user.id)


@router.get("/documents/{document_id}/telecharger")
async def telecharger_document(
    document_id: str, token: str, db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        token_document_id = decode_download_token(token)
    except ValueError as error:
        raise AppError(str(error), status_code=status.HTTP_401_UNAUTHORIZED) from error

    if token_document_id != document_id:
        raise AppError("Token invalide pour ce document", status_code=status.HTTP_403_FORBIDDEN)

    storage_url = await documents_service.get_storage_url(db, document_id)
    if storage_url is None:
        raise AppError("Document introuvable", status_code=status.HTTP_404_NOT_FOUND)

    return RedirectResponse(storage_url)


@router.get("/certificats")
async def get_certificats(
    current_user: CurrentUser = Depends(require_roles("apprenant")),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await certificats_service.list_certificats_for_apprenant(db, current_user.id)
