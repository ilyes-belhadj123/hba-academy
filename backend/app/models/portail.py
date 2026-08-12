from datetime import datetime

from pydantic import BaseModel


class PlanningItem(BaseModel):
    formation_id: str
    formation_titre: str
    session_id: str | None
    date_debut: datetime | None
    date_fin: datetime | None
    progression: int
