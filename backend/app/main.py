import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.logging import configure_logging
from app.db.mongodb import close_mongo_connection, connect_to_mongo, ensure_indexes
from app.routers import admin, auth, formations, health, preinscriptions, sessions

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

    app.include_router(health.router)
    app.include_router(formations.router, prefix="/api")
    app.include_router(sessions.router, prefix="/api")
    app.include_router(preinscriptions.router, prefix="/api")
    app.include_router(auth.router, prefix="/api")
    app.include_router(admin.router, prefix="/api")

    return app


app = create_app()
