from typing import Literal

from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    session_id: str
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    message: str
    langue: Literal["fr", "derja"]
    escalade: bool
    preinscription_confirmee: bool
