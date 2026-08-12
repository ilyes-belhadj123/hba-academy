import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None


def connect_to_mongo() -> None:
    global _client
    settings = get_settings()
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    logger.info("Connected to MongoDB at %s", settings.mongodb_uri)


def close_mongo_connection() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
        logger.info("Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase:
    if _client is None:
        raise RuntimeError("MongoDB client is not initialized")
    settings = get_settings()
    return _client[settings.mongodb_db_name]


async def ping_database() -> bool:
    if _client is None:
        return False
    await _client.admin.command("ping")
    return True


def get_db() -> AsyncIOMotorDatabase:
    return get_database()


async def ensure_indexes() -> None:
    db = get_database()
    await db.formations.create_index("filiere")
    await db.formations.create_index("niveau")
    await db.formations.create_index("mode")
    await db.formations.create_index([("age_min", 1), ("age_max", 1)])
    await db.formations.create_index("prix")
    await db.sessions.create_index("formation_id")
    await db.temoignages.create_index([("formation_id", 1), ("statut_publication", 1)])
    await db.preinscriptions.create_index("session_id")
    await db.preinscriptions.create_index("lead_id")
    await db.leads.create_index("source")
    await db.users.create_index("email", unique=True)
    await db.formateurs.create_index("filieres")
    await db.formateurs.create_index("formations_dispensees")
    logger.info("MongoDB indexes ensured")
