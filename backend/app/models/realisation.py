from datetime import date as DateType
from typing import Literal

from pydantic import BaseModel, Field

TypeRealisation = Literal["chiffre_cle", "concours", "partenariat", "evenement"]


class RealisationOut(BaseModel):
    id: str = Field(alias="_id")
    type: TypeRealisation
    titre: str
    description: str
    date: DateType
    media: list[str] = []
    mise_en_avant: bool = False
    valeur: float | None = None

    model_config = {"populate_by_name": True}


class RealisationIn(BaseModel):
    type: TypeRealisation
    titre: str
    description: str
    date: DateType
    media: list[str] = []
    mise_en_avant: bool = False
    valeur: float | None = None


class RealisationUpdate(BaseModel):
    type: TypeRealisation | None = None
    titre: str | None = None
    description: str | None = None
    date: DateType | None = None
    media: list[str] | None = None
    mise_en_avant: bool | None = None
    valeur: float | None = None
