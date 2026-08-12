from pydantic import BaseModel, EmailStr, Field


class FormationSuivie(BaseModel):
    formation_id: str
    session_id: str | None = None
    progression: int = 0


class ApprenantOut(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    nom: str
    formations_suivies: list[FormationSuivie] = []

    model_config = {"populate_by_name": True}


class ApprenantIn(BaseModel):
    email: EmailStr
    nom: str
    password: str = Field(min_length=8)


class EnrollIn(BaseModel):
    formation_id: str
    session_id: str | None = None
