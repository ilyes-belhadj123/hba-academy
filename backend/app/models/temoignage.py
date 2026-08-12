from typing import Literal

from pydantic import BaseModel, Field

StatutPublication = Literal["brouillon", "publie"]


class TemoignageOut(BaseModel):
    id: str = Field(alias="_id")
    formation_id: str
    auteur: str
    contenu: str
    media: list[str] = []
    statut_publication: StatutPublication

    model_config = {"populate_by_name": True}


class TemoignageIn(BaseModel):
    formation_id: str
    auteur: str
    contenu: str
    media: list[str] = []
    statut_publication: StatutPublication = "brouillon"


class TemoignageUpdate(BaseModel):
    formation_id: str | None = None
    auteur: str | None = None
    contenu: str | None = None
    media: list[str] | None = None
    statut_publication: StatutPublication | None = None
