# app/routers/chat.py
from fastapi import APIRouter
from models.models import ChatRequest
from services.chat_service import handle_chat

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/")
async def chat(req: ChatRequest):
    return await handle_chat(req)
