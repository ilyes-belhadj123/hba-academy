from datetime import datetime

from pydantic import BaseModel, Field


class SessionOut(BaseModel):
    id: str = Field(alias="_id")
    formation_id: str
    date_debut: datetime
    date_fin: datetime
    capacite_max: int
    places_prises: int
    places_restantes: int
    formateur_id: str | None = None

    model_config = {"populate_by_name": True}


class SessionIn(BaseModel):
    formation_id: str
    date_debut: datetime
    date_fin: datetime
    capacite_max: int
    formateur_id: str | None = None


class SessionUpdate(BaseModel):
    date_debut: datetime | None = None
    date_fin: datetime | None = None
    capacite_max: int | None = None
    formateur_id: str | None = None
