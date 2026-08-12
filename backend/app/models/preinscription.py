from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

StatutPreinscription = Literal["en_attente", "confirmee", "annulee"]


class PreinscriptionIn(BaseModel):
    session_id: str
    nom: str = Field(min_length=1)
    email: EmailStr
    telephone: str = Field(min_length=1)
    mineur: bool = False
    consentement_parental: bool = False


class PreinscriptionOut(BaseModel):
    id: str = Field(alias="_id")
    lead_id: str
    session_id: str
    statut: StatutPreinscription
    date_creation: datetime

    model_config = {"populate_by_name": True}
