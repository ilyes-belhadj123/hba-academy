from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.realisation import RealisationIn, RealisationUpdate


async def list_realisations(
    db: AsyncIOMotorDatabase, type_: str | None = None, mise_en_avant: bool | None = None
) -> list[dict]:
    query: dict = {}
    if type_:
        query["type"] = type_
    if mise_en_avant is not None:
        query["mise_en_avant"] = mise_en_avant

    cursor = db.realisations.find(query).sort("date", -1)
    realisations = await cursor.to_list(length=None)
    for realisation in realisations:
        realisation["_id"] = str(realisation["_id"])
    return realisations


async def list_all_realisations(db: AsyncIOMotorDatabase) -> list[dict]:
    return await list_realisations(db)


async def get_realisation_by_id(db: AsyncIOMotorDatabase, realisation_id: str) -> dict | None:
    try:
        object_id = ObjectId(realisation_id)
    except InvalidId:
        return None

    realisation = await db.realisations.find_one({"_id": object_id})
    if realisation:
        realisation["_id"] = str(realisation["_id"])
    return realisation


async def create_realisation(db: AsyncIOMotorDatabase, payload: RealisationIn) -> dict:
    document = payload.model_dump()
    document["date"] = payload.date.isoformat()
    result = await db.realisations.insert_one(document)
    return await get_realisation_by_id(db, str(result.inserted_id))


async def update_realisation(
    db: AsyncIOMotorDatabase, realisation_id: str, payload: RealisationUpdate
) -> dict | None:
    try:
        object_id = ObjectId(realisation_id)
    except InvalidId:
        return None

    changes = payload.model_dump(exclude_unset=True)
    if "date" in changes and changes["date"] is not None:
        changes["date"] = changes["date"].isoformat()
    if changes:
        await db.realisations.update_one({"_id": object_id}, {"$set": changes})
    return await get_realisation_by_id(db, realisation_id)


async def delete_realisation(db: AsyncIOMotorDatabase, realisation_id: str) -> bool:
    try:
        object_id = ObjectId(realisation_id)
    except InvalidId:
        return False

    result = await db.realisations.delete_one({"_id": object_id})
    return result.deleted_count > 0
