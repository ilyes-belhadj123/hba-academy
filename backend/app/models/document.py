from datetime import datetime

from pydantic import BaseModel, Field


class DocumentOut(BaseModel):
    id: str = Field(alias="_id")
    titre: str
    formation_id: str | None = None
    created_at: datetime
    download_url: str

    model_config = {"populate_by_name": True}
