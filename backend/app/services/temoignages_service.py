from motor.motor_asyncio import AsyncIOMotorDatabase


async def list_temoignages_publies(db: AsyncIOMotorDatabase, formation_id: str) -> list[dict]:
    cursor = db.temoignages.find({"formation_id": formation_id, "statut_publication": "publie"})
    temoignages = await cursor.to_list(length=None)
    for temoignage in temoignages:
        temoignage["_id"] = str(temoignage["_id"])
    return temoignages
