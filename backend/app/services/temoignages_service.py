from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.temoignage import TemoignageIn, TemoignageUpdate


async def list_temoignages_publies(db: AsyncIOMotorDatabase, formation_id: str) -> list[dict]:
    cursor = db.temoignages.find({"formation_id": formation_id, "statut_publication": "publie"})
    temoignages = await cursor.to_list(length=None)
    for temoignage in temoignages:
        temoignage["_id"] = str(temoignage["_id"])
    return temoignages


async def list_all_temoignages_publies(db: AsyncIOMotorDatabase) -> list[dict]:
    cursor = db.temoignages.find({"statut_publication": "publie"})
    temoignages = await cursor.to_list(length=None)
    for temoignage in temoignages:
        temoignage["_id"] = str(temoignage["_id"])
    return temoignages


async def list_all_temoignages(db: AsyncIOMotorDatabase) -> list[dict]:
    cursor = db.temoignages.find({})
    temoignages = await cursor.to_list(length=None)
    for temoignage in temoignages:
        temoignage["_id"] = str(temoignage["_id"])
    return temoignages


async def get_temoignage_by_id(db: AsyncIOMotorDatabase, temoignage_id: str) -> dict | None:
    try:
        object_id = ObjectId(temoignage_id)
    except InvalidId:
        return None

    temoignage = await db.temoignages.find_one({"_id": object_id})
    if temoignage:
        temoignage["_id"] = str(temoignage["_id"])
    return temoignage


async def create_temoignage(db: AsyncIOMotorDatabase, payload: TemoignageIn) -> dict:
    result = await db.temoignages.insert_one(payload.model_dump())
    return await get_temoignage_by_id(db, str(result.inserted_id))


async def update_temoignage(db: AsyncIOMotorDatabase, temoignage_id: str, payload: TemoignageUpdate) -> dict | None:
    try:
        object_id = ObjectId(temoignage_id)
    except InvalidId:
        return None

    changes = payload.model_dump(exclude_unset=True)
    if changes:
        await db.temoignages.update_one({"_id": object_id}, {"$set": changes})
    return await get_temoignage_by_id(db, temoignage_id)


async def delete_temoignage(db: AsyncIOMotorDatabase, temoignage_id: str) -> bool:
    try:
        object_id = ObjectId(temoignage_id)
    except InvalidId:
        return False

    result = await db.temoignages.delete_one({"_id": object_id})
    return result.deleted_count > 0
