from fastapi import APIRouter

from app.db.mongodb import ping_database

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    try:
        db_ok = await ping_database()
    except Exception:
        db_ok = False

    return {"status": "ok", "database": "ok" if db_ok else "unavailable"}
