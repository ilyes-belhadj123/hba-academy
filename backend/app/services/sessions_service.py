from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.session import SessionIn, SessionUpdate


def _with_places_restantes(session: dict) -> dict:
    session["_id"] = str(session["_id"])
    session["places_restantes"] = max(session["capacite_max"] - session["places_prises"], 0)
    return session


async def list_sessions(db: AsyncIOMotorDatabase, formation_id: str | None = None) -> list[dict]:
    query: dict = {}
    if formation_id:
        query["formation_id"] = formation_id

    cursor = db.sessions.find(query).sort("date_debut", 1)
    sessions = await cursor.to_list(length=None)
    return [_with_places_restantes(session) for session in sessions]


async def get_session_by_id(db: AsyncIOMotorDatabase, session_id: str) -> dict | None:
    try:
        object_id = ObjectId(session_id)
    except InvalidId:
        return None

    session = await db.sessions.find_one({"_id": object_id})
    return _with_places_restantes(session) if session else None


async def create_session(db: AsyncIOMotorDatabase, payload: SessionIn) -> dict:
    document = payload.model_dump()
    document["places_prises"] = 0
    result = await db.sessions.insert_one(document)
    return await get_session_by_id(db, str(result.inserted_id))


async def update_session(db: AsyncIOMotorDatabase, session_id: str, payload: SessionUpdate) -> dict | None:
    try:
        object_id = ObjectId(session_id)
    except InvalidId:
        return None

    changes = payload.model_dump(exclude_unset=True)
    if changes:
        await db.sessions.update_one({"_id": object_id}, {"$set": changes})
    return await get_session_by_id(db, session_id)


async def delete_session(db: AsyncIOMotorDatabase, session_id: str) -> bool:
    try:
        object_id = ObjectId(session_id)
    except InvalidId:
        return False

    result = await db.sessions.delete_one({"_id": object_id})
    return result.deleted_count > 0
