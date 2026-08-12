from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.errors import AppError
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.db.mongodb import get_db
from app.models.user import LoginIn, RefreshIn, TokenPair
from app.services.auth_service import authenticate_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenPair)
async def login(payload: LoginIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise AppError("Email ou mot de passe incorrect", status_code=status.HTTP_401_UNAUTHORIZED)

    user_id = str(user["_id"])
    return TokenPair(
        access_token=create_access_token(user_id, user["role"]),
        refresh_token=create_refresh_token(user_id, user["role"]),
    )


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshIn):
    try:
        decoded = decode_token(payload.refresh_token)
    except ValueError as error:
        raise AppError(str(error), status_code=status.HTTP_401_UNAUTHORIZED) from error

    if decoded.get("type") != "refresh":
        raise AppError("Token invalide", status_code=status.HTTP_401_UNAUTHORIZED)

    return TokenPair(
        access_token=create_access_token(decoded["sub"], decoded["role"]),
        refresh_token=create_refresh_token(decoded["sub"], decoded["role"]),
    )
