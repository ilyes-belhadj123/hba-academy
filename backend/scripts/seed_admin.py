"""Crée (ou réinitialise le mot de passe d') un compte admin pour le backoffice.

Le mot de passe est généré aléatoirement et affiché une seule fois : à noter
immédiatement et à changer après la première connexion.

Usage : python scripts/seed_admin.py [email]
"""

import asyncio
import secrets
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.core.security import hash_password
from app.db.mongodb import close_mongo_connection, connect_to_mongo, get_database

DEFAULT_ADMIN_EMAIL = "admin@hba-academy.example"


async def seed_admin(email: str) -> None:
    connect_to_mongo()
    db = get_database()

    password = secrets.token_urlsafe(12)
    password_hash = hash_password(password)

    await db.users.update_one(
        {"email": email},
        {"$set": {"email": email, "nom": "Administrateur HBA", "role": "admin", "password_hash": password_hash}},
        upsert=True,
    )

    print(f"Compte admin prêt : {email}")
    print(f"Mot de passe (à noter maintenant, non ré-affichable) : {password}")

    close_mongo_connection()


if __name__ == "__main__":
    target_email = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_ADMIN_EMAIL
    asyncio.run(seed_admin(target_email))
