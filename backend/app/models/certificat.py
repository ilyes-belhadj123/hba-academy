from datetime import date, datetime

from pydantic import BaseModel, Field


class CertificatGenererIn(BaseModel):
    user_id: str
    formation_id: str


class CertificatOut(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    formation_id: str
    date_emission: datetime
    code_verification: str
    url_pdf: str

    model_config = {"populate_by_name": True}


class CertificatVerificationOut(BaseModel):
    valide: bool
    nom_affiche: str | None = None
    formation_titre: str | None = None
    date_emission: date | None = None
