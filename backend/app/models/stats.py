from pydantic import BaseModel


class StatParSource(BaseModel):
    source: str
    total: int
    convertis: int
    taux_conversion: float


class StatFormationDemandee(BaseModel):
    formation_id: str | None
    formation_titre: str
    total: int


class StatsOut(BaseModel):
    total_leads: int
    total_convertis: int
    taux_conversion_global: float
    par_source: list[StatParSource]
    formations_les_plus_demandees: list[StatFormationDemandee]
