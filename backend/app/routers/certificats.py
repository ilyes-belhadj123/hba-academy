from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import require_roles
from app.db.mongodb import get_db
from app.models.certificat import CertificatGenererIn, CertificatOut, CertificatVerificationOut
from app.services import certificats_service

router = APIRouter(prefix="/certificats", tags=["certificats"])


@router.post(
    "/generer",
    response_model=CertificatOut,
    dependencies=[Depends(require_roles("admin", "formateur"))],
)
async def generer(payload: CertificatGenererIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await certificats_service.generer_certificat(db, payload.user_id, payload.formation_id)


@router.get("/verifier/{code}", response_model=CertificatVerificationOut)
async def verifier(code: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await certificats_service.verifier_certificat(db, code)
