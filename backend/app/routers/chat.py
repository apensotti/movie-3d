# app/routers/chat.py
from fastapi import APIRouter
from models.models import ChatRequest
from services.chat_service import handle_chat, Chat

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/")
async def chat(req: ChatRequest):
    return await handle_chat(req)

@router.post("/stream") 
async def chat_stream (req: ChatRequest):
    return await Chat().handle_chat_stream(req)