from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase


def _build_match(date_debut: datetime | None, date_fin: datetime | None) -> dict:
    match: dict = {}
    created_at_filter: dict = {}
    if date_debut:
        created_at_filter["$gte"] = date_debut
    if date_fin:
        created_at_filter["$lte"] = date_fin
    if created_at_filter:
        match["created_at"] = created_at_filter
    return match


async def get_stats(
    db: AsyncIOMotorDatabase, date_debut: datetime | None = None, date_fin: datetime | None = None
) -> dict:
    match = _build_match(date_debut, date_fin)

    total_leads = await db.leads.count_documents(match)
    total_convertis = await db.leads.count_documents({**match, "statut": "converti"})
    taux_conversion_global = (total_convertis / total_leads * 100) if total_leads else 0.0

    par_source_cursor = db.leads.aggregate(
        [
            {"$match": match},
            {
                "$group": {
                    "_id": "$source",
                    "total": {"$sum": 1},
                    "convertis": {"$sum": {"$cond": [{"$eq": ["$statut", "converti"]}, 1, 0]}},
                }
            },
            {"$sort": {"total": -1}},
        ]
    )
    par_source = []
    async for row in par_source_cursor:
        total = row["total"]
        convertis = row["convertis"]
        par_source.append(
            {
                "source": row["_id"],
                "total": total,
                "convertis": convertis,
                "taux_conversion": (convertis / total * 100) if total else 0.0,
            }
        )

    formations_cursor = db.leads.aggregate(
        [
            {"$match": {**match, "formation_interet": {"$ne": None}}},
            {"$group": {"_id": "$formation_interet", "total": {"$sum": 1}}},
            {"$sort": {"total": -1}},
            {"$limit": 5},
        ]
    )
    formations_les_plus_demandees = []
    async for row in formations_cursor:
        formation_titre = "Formation supprimée"
        try:
            formation = await db.formations.find_one({"_id": ObjectId(row["_id"])})
            if formation:
                formation_titre = formation["titre"]
        except InvalidId:
            pass
        formations_les_plus_demandees.append(
            {"formation_id": row["_id"], "formation_titre": formation_titre, "total": row["total"]}
        )

    return {
        "total_leads": total_leads,
        "total_convertis": total_convertis,
        "taux_conversion_global": taux_conversion_global,
        "par_source": par_source,
        "formations_les_plus_demandees": formations_les_plus_demandees,
    }
