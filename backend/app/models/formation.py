from typing import Literal

from pydantic import BaseModel, Field

Mode = Literal["presentiel", "en_ligne"]
Niveau = Literal["debutant", "intermediaire", "avance"]


class FormationOut(BaseModel):
    id: str = Field(alias="_id")
    filiere: str
    titre: str
    description: str
    prerequis: str
    duree: str
    age_min: int
    age_max: int
    prix: float
    niveau: Niveau
    mode: Mode
    medias: list[str] = []
    badges_competences: list[str] = []

    model_config = {"populate_by_name": True}


class FormationIn(BaseModel):
    filiere: str
    titre: str
    description: str
    prerequis: str
    duree: str
    age_min: int
    age_max: int
    prix: float
    niveau: Niveau
    mode: Mode
    medias: list[str] = []
    badges_competences: list[str] = []


class FormationUpdate(BaseModel):
    filiere: str | None = None
    titre: str | None = None
    description: str | None = None
    prerequis: str | None = None
    duree: str | None = None
    age_min: int | None = None
    age_max: int | None = None
    prix: float | None = None
    niveau: Niveau | None = None
    mode: Mode | None = None
    medias: list[str] | None = None
    badges_competences: list[str] | None = None
