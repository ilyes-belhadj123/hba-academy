from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

StatutLead = Literal["nouveau", "qualifie", "converti", "perdu"]


class Coordonnees(BaseModel):
    nom: str
    email: str
    telephone: str


class LeadOut(BaseModel):
    id: str = Field(alias="_id")
    source: str
    coordonnees: Coordonnees
    formation_interet: str | None = None
    formation_titre: str | None = None
    statut: StatutLead
    created_at: datetime | None = None

    model_config = {"populate_by_name": True}


class LeadUpdateIn(BaseModel):
    statut: StatutLead
