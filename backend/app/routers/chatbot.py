from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.mongodb import get_db
from app.models.chatbot import ChatRequest, ChatResponse
from app.services import chatbot_service

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/message", response_model=ChatResponse)
async def send_message(payload: ChatRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await chatbot_service.handle_message(db, payload.session_id, payload.messages)
    return ChatResponse(**result)
