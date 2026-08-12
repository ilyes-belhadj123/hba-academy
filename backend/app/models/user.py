from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Role = Literal["visitor", "prospect", "apprenant", "formateur", "admin"]


class UserOut(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    nom: str
    role: Role

    model_config = {"populate_by_name": True}


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshIn(BaseModel):
    refresh_token: str
