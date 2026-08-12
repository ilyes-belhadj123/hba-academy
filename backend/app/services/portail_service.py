from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase


async def get_planning(db: AsyncIOMotorDatabase, apprenant: dict) -> list[dict]:
    items = []
    for suivie in apprenant.get("formations_suivies", []):
        formation = await db.formations.find_one({"_id": ObjectId(suivie["formation_id"])})
        if formation is None:
            continue

        session = None
        if suivie.get("session_id"):
            session = await db.sessions.find_one({"_id": ObjectId(suivie["session_id"])})

        items.append(
            {
                "formation_id": suivie["formation_id"],
                "formation_titre": formation["titre"],
                "session_id": suivie.get("session_id"),
                "date_debut": session["date_debut"] if session else None,
                "date_fin": session["date_fin"] if session else None,
                "progression": suivie.get("progression", 0),
            }
        )
    return items
