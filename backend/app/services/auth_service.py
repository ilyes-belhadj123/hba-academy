from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import verify_password


async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str) -> dict | None:
    user = await db.users.find_one({"email": email})
    if user is None:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user
