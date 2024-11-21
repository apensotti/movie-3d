# app/routers/users.py
from fastapi import APIRouter
from models.models import user, session, ChatRequest
from utils.mongodb import get_user_sessions, create_session, update_session, get_session, get_messages

router = APIRouter(prefix="/sessions", tags=["Sessions"])

@router.post("/create_session/")
async def create(req: ChatRequest):
    return await create_session(req)

@router.post("/update_session/")
async def update(req: ChatRequest):
    return await update_session(req)

@router.get("/get_user_sessions/")
async def user_sessions(email: str):
    return await get_user_sessions(email)

@router.get("/get_messages/")
async def session_messages(session_id: str):
    return await get_messages(session_id)
