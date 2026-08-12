from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.formateur import FormateurIn, FormateurUpdate


async def list_formateurs(
    db: AsyncIOMotorDatabase, filiere: str | None = None, formation_id: str | None = None
) -> list[dict]:
    query: dict = {}
    if filiere:
        query["filieres"] = filiere
    if formation_id:
        query["formations_dispensees"] = formation_id

    cursor = db.formateurs.find(query).sort("nom", 1)
    formateurs = await cursor.to_list(length=None)
    for formateur in formateurs:
        formateur["_id"] = str(formateur["_id"])
    return formateurs


async def get_formateur_by_id(db: AsyncIOMotorDatabase, formateur_id: str) -> dict | None:
    try:
        object_id = ObjectId(formateur_id)
    except InvalidId:
        return None

    formateur = await db.formateurs.find_one({"_id": object_id})
    if formateur:
        formateur["_id"] = str(formateur["_id"])
    return formateur


async def create_formateur(db: AsyncIOMotorDatabase, payload: FormateurIn) -> dict:
    result = await db.formateurs.insert_one(payload.model_dump())
    return await get_formateur_by_id(db, str(result.inserted_id))


async def update_formateur(db: AsyncIOMotorDatabase, formateur_id: str, payload: FormateurUpdate) -> dict | None:
    try:
        object_id = ObjectId(formateur_id)
    except InvalidId:
        return None

    changes = payload.model_dump(exclude_unset=True)
    if changes:
        await db.formateurs.update_one({"_id": object_id}, {"$set": changes})
    return await get_formateur_by_id(db, formateur_id)


async def delete_formateur(db: AsyncIOMotorDatabase, formateur_id: str) -> bool:
    try:
        object_id = ObjectId(formateur_id)
    except InvalidId:
        return False

    result = await db.formateurs.delete_one({"_id": object_id})
    return result.deleted_count > 0
