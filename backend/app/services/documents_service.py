from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.core.security import create_download_token


def _with_download_url(document: dict) -> dict:
    settings = get_settings()
    token = create_download_token(str(document["_id"]))
    document["_id"] = str(document["_id"])
    document["download_url"] = f"{settings.public_base_url}/api/portail/documents/{document['_id']}/telecharger?token={token}"
    return document


async def create_document(
    db: AsyncIOMotorDatabase, apprenant_id: str, titre: str, storage_url: str, formation_id: str | None
) -> dict:
    document = {
        "apprenant_id": apprenant_id,
        "titre": titre,
        "storage_url": storage_url,
        "formation_id": formation_id,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.documents.insert_one(document)
    document["_id"] = result.inserted_id
    return _with_download_url(document)


async def list_documents_for_apprenant(db: AsyncIOMotorDatabase, apprenant_id: str) -> list[dict]:
    cursor = db.documents.find({"apprenant_id": apprenant_id}).sort("created_at", -1)
    documents = await cursor.to_list(length=None)
    return [_with_download_url(document) for document in documents]


async def get_storage_url(db: AsyncIOMotorDatabase, document_id: str) -> str | None:
    try:
        object_id = ObjectId(document_id)
    except InvalidId:
        return None

    document = await db.documents.find_one({"_id": object_id})
    return document["storage_url"] if document else None
