from typing import Literal

from pydantic import BaseModel, EmailStr

from app.models.formation import FormationOut

NiveauOrientation = Literal["debutant", "intermediaire", "avance"]
ModeOrientation = Literal["presentiel", "en_ligne", "peu_importe"]


class OrientationReponses(BaseModel):
    objectif: str
    filiere_cible: str
    niveau: NiveauOrientation
    mode: ModeOrientation
    age: int | None = None


class RecommandationOut(BaseModel):
    formation_principale: FormationOut
    alternatives: list[FormationOut]
    justification: str
    source: Literal["ia", "regles"]


class EnvoyerResultatIn(BaseModel):
    email: EmailStr
    formation_principale_id: str
    alternatives_ids: list[str] = []
    justification: str
