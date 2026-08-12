import os

os.environ["MONGODB_DB_NAME"] = "hba_connect_test"
os.environ["OPENROUTER_API_KEY"] = ""
os.environ["JWT_SECRET_KEY"] = "test-secret-key"
os.environ["SMTP_HOST"] = ""

from datetime import datetime

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.security import hash_password
from app.db.mongodb import close_mongo_connection, connect_to_mongo, ensure_indexes, get_database
from app.main import app


@pytest_asyncio.fixture
async def db():
    connect_to_mongo()
    database = get_database()
    await ensure_indexes()
    yield database
    for name in await database.list_collection_names():
        await database[name].delete_many({})
    close_mongo_connection()


@pytest_asyncio.fixture
async def client(db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def admin_token(db, client):
    await db.users.insert_one(
        {
            "email": "admin.test@example.com",
            "nom": "Admin Test",
            "role": "admin",
            "password_hash": hash_password("TestPassword123"),
            "formations_suivies": [],
        }
    )
    response = await client.post(
        "/api/auth/login", json={"email": "admin.test@example.com", "password": "TestPassword123"}
    )
    return response.json()["access_token"]


@pytest_asyncio.fixture
async def seeded_formation(db):
    formation = {
        "filiere": "Langues",
        "titre": "Formation de test",
        "description": "Formation créée pour les tests automatisés.",
        "prerequis": "Aucun",
        "duree": "4 semaines",
        "age_min": 18,
        "age_max": 99,
        "prix": 200.0,
        "niveau": "debutant",
        "mode": "presentiel",
        "medias": [],
        "badges_competences": [],
    }
    result = await db.formations.insert_one(formation)
    formation["_id"] = str(result.inserted_id)
    return formation


@pytest_asyncio.fixture
async def seeded_session(db, seeded_formation):
    session = {
        "formation_id": seeded_formation["_id"],
        "date_debut": datetime(2027, 1, 1),
        "date_fin": datetime(2027, 2, 1),
        "capacite_max": 1,
        "places_prises": 0,
        "formateur_id": None,
    }
    result = await db.sessions.insert_one(session)
    session["_id"] = str(result.inserted_id)
    return session
