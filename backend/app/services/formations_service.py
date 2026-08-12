from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.formation import FormationIn, FormationUpdate


async def list_formations(
    db: AsyncIOMotorDatabase,
    filiere: str | None = None,
    age: int | None = None,
    duree: str | None = None,
    prix_max: float | None = None,
    niveau: str | None = None,
    mode: str | None = None,
) -> list[dict]:
    query: dict = {}

    if filiere:
        query["filiere"] = filiere
    if duree:
        query["duree"] = duree
    if niveau:
        query["niveau"] = niveau
    if mode:
        query["mode"] = mode
    if age is not None:
        query["age_min"] = {"$lte": age}
        query["age_max"] = {"$gte": age}
    if prix_max is not None:
        query["prix"] = {"$lte": prix_max}

    cursor = db.formations.find(query).sort("titre", 1)
    formations = await cursor.to_list(length=None)
    for formation in formations:
        formation["_id"] = str(formation["_id"])
    return formations


async def list_filieres(db: AsyncIOMotorDatabase) -> list[str]:
    return sorted(await db.formations.distinct("filiere"))


async def get_formation_by_id(db: AsyncIOMotorDatabase, formation_id: str) -> dict | None:
    try:
        object_id = ObjectId(formation_id)
    except InvalidId:
        return None

    formation = await db.formations.find_one({"_id": object_id})
    if formation:
        formation["_id"] = str(formation["_id"])
    return formation


async def create_formation(db: AsyncIOMotorDatabase, payload: FormationIn) -> dict:
    result = await db.formations.insert_one(payload.model_dump())
    return await get_formation_by_id(db, str(result.inserted_id))


async def update_formation(db: AsyncIOMotorDatabase, formation_id: str, payload: FormationUpdate) -> dict | None:
    try:
        object_id = ObjectId(formation_id)
    except InvalidId:
        return None

    changes = payload.model_dump(exclude_unset=True)
    if changes:
        await db.formations.update_one({"_id": object_id}, {"$set": changes})
    return await get_formation_by_id(db, formation_id)


async def delete_formation(db: AsyncIOMotorDatabase, formation_id: str) -> bool:
    try:
        object_id = ObjectId(formation_id)
    except InvalidId:
        return False

    result = await db.formations.delete_one({"_id": object_id})
    return result.deleted_count > 0
