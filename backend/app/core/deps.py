from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer

from app.core.errors import AppError
from app.core.security import decode_token

_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


class CurrentUser:
    def __init__(self, user_id: str, role: str):
        self.id = user_id
        self.role = role


async def get_current_user(token: str | None = Depends(_oauth2_scheme)) -> CurrentUser:
    if token is None:
        raise AppError("Authentification requise", status_code=status.HTTP_401_UNAUTHORIZED)

    try:
        payload = decode_token(token)
    except ValueError as error:
        raise AppError(str(error), status_code=status.HTTP_401_UNAUTHORIZED) from error

    if payload.get("type") != "access":
        raise AppError("Token invalide", status_code=status.HTTP_401_UNAUTHORIZED)

    return CurrentUser(user_id=payload["sub"], role=payload["role"])


def require_roles(*allowed_roles: str):
    async def _check(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if current_user.role not in allowed_roles:
            raise AppError("Accès refusé pour ce rôle", status_code=status.HTTP_403_FORBIDDEN)
        return current_user

    return _check
