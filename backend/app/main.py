import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.logging import configure_logging
from app.db.mongodb import close_mongo_connection, connect_to_mongo, ensure_indexes
from app.routers import admin, auth, formateurs, formations, health, preinscriptions, sessions, temoignages

configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_mongo()
    await ensure_indexes()
    logger.info("HBA Connect API started")
    yield
    close_mongo_connection()
    logger.info("HBA Connect API stopped")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title="HBA Connect API", version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    if settings.storage_backend == "local":
        uploads_path = Path(settings.uploads_dir)
        uploads_path.mkdir(parents=True, exist_ok=True)
        app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

    app.include_router(health.router)
    app.include_router(formations.router, prefix="/api")
    app.include_router(sessions.router, prefix="/api")
    app.include_router(preinscriptions.router, prefix="/api")
    app.include_router(auth.router, prefix="/api")
    app.include_router(admin.router, prefix="/api")
    app.include_router(temoignages.router, prefix="/api")
    app.include_router(formateurs.router, prefix="/api")

    return app


app = create_app()
