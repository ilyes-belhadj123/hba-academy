from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import hash_password
from app.models.apprenant import ApprenantIn, EnrollIn


async def get_apprenant_by_id(db: AsyncIOMotorDatabase, apprenant_id: str) -> dict | None:
    try:
        object_id = ObjectId(apprenant_id)
    except InvalidId:
        return None

    apprenant = await db.users.find_one({"_id": object_id, "role": "apprenant"})
    if apprenant:
        apprenant["_id"] = str(apprenant["_id"])
    return apprenant


async def list_apprenants(db: AsyncIOMotorDatabase) -> list[dict]:
    cursor = db.users.find({"role": "apprenant"}).sort("nom", 1)
    apprenants = await cursor.to_list(length=None)
    for apprenant in apprenants:
        apprenant["_id"] = str(apprenant["_id"])
    return apprenants


async def create_apprenant(db: AsyncIOMotorDatabase, payload: ApprenantIn) -> dict:
    document = {
        "email": payload.email,
        "nom": payload.nom,
        "role": "apprenant",
        "password_hash": hash_password(payload.password),
        "formations_suivies": [],
    }
    result = await db.users.insert_one(document)
    return await get_apprenant_by_id(db, str(result.inserted_id))


async def enroll(db: AsyncIOMotorDatabase, apprenant_id: str, payload: EnrollIn) -> dict | None:
    try:
        object_id = ObjectId(apprenant_id)
    except InvalidId:
        return None

    await db.users.update_one(
        {"_id": object_id, "role": "apprenant", "formations_suivies.formation_id": {"$ne": payload.formation_id}},
        {
            "$push": {
                "formations_suivies": {
                    "formation_id": payload.formation_id,
                    "session_id": payload.session_id,
                    "progression": 0,
                }
            }
        },
    )
    return await get_apprenant_by_id(db, apprenant_id)
