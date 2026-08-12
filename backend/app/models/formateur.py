from pydantic import BaseModel, Field


class FormateurOut(BaseModel):
    id: str = Field(alias="_id")
    nom: str
    photo: str | None = None
    filieres: list[str] = []
    bio: str
    experiences_professionnelles: list[str] = []
    certifications: list[str] = []
    formations_dispensees: list[str] = []
    temoignages_specifiques: list[str] = []

    model_config = {"populate_by_name": True}


class FormateurIn(BaseModel):
    nom: str
    photo: str | None = None
    filieres: list[str] = []
    bio: str
    experiences_professionnelles: list[str] = []
    certifications: list[str] = []
    formations_dispensees: list[str] = []
    temoignages_specifiques: list[str] = []


class FormateurUpdate(BaseModel):
    nom: str | None = None
    photo: str | None = None
    filieres: list[str] | None = None
    bio: str | None = None
    experiences_professionnelles: list[str] | None = None
    certifications: list[str] | None = None
    formations_dispensees: list[str] | None = None
    temoignages_specifiques: list[str] | None = None
