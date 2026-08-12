import csv
import io

from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

CSV_HEADERS = ["id", "source", "nom", "email", "telephone", "formation_interet", "statut", "created_at"]


async def _resolve_formation_titre(db: AsyncIOMotorDatabase, formation_id: str | None) -> str | None:
    if not formation_id:
        return None
    try:
        formation = await db.formations.find_one({"_id": ObjectId(formation_id)})
    except InvalidId:
        return "Formation supprimée"
    return formation["titre"] if formation else "Formation supprimée"


async def list_leads(
    db: AsyncIOMotorDatabase, source: str | None = None, statut: str | None = None
) -> list[dict]:
    query: dict = {}
    if source:
        query["source"] = source
    if statut:
        query["statut"] = statut

    cursor = db.leads.find(query).sort("created_at", -1)
    leads = await cursor.to_list(length=None)

    for lead in leads:
        lead["_id"] = str(lead["_id"])
        lead["formation_titre"] = await _resolve_formation_titre(db, lead.get("formation_interet"))

    return leads


async def update_lead_statut(db: AsyncIOMotorDatabase, lead_id: str, statut: str) -> dict | None:
    try:
        object_id = ObjectId(lead_id)
    except InvalidId:
        return None

    await db.leads.update_one({"_id": object_id}, {"$set": {"statut": statut}})
    lead = await db.leads.find_one({"_id": object_id})
    if lead is None:
        return None
    lead["_id"] = str(lead["_id"])
    lead["formation_titre"] = await _resolve_formation_titre(db, lead.get("formation_interet"))
    return lead


async def export_leads_csv(db: AsyncIOMotorDatabase) -> str:
    leads = await list_leads(db)
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(CSV_HEADERS)

    for lead in leads:
        coordonnees = lead.get("coordonnees", {})
        writer.writerow(
            [
                lead["_id"],
                lead["source"],
                coordonnees.get("nom", ""),
                coordonnees.get("email", ""),
                coordonnees.get("telephone", ""),
                lead.get("formation_titre") or "",
                lead["statut"],
                lead.get("created_at").isoformat() if lead.get("created_at") else "",
            ]
        )

    return buffer.getvalue()
