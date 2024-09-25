from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.encoders import jsonable_encoder
from models.models import user, session
import os
import uuid

## Ping MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")

def ping_mongodb():
    client = AsyncIOMotorClient(MONGODB_URI)
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

def get_db():
    client = AsyncIOMotorClient(MONGODB_URI)
    return client['mw_users']

## User Level Operations
async def create_user(user):
    db = get_db()
    try:
        validate_user(user.email)

        user_data = jsonable_encoder(user)
        resp = await db.users.insert_one(user_data)

        return {"status_code": 200, "id": str(resp.inserted_id)}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"status_code": 500, "error": "An error occurred"}

async def validate_user(email):
    db = get_db()
    user_search = await db.users.find_one({"email": email})
    if not user_search:
        return {"status_code": 404, "error": "User not found"}
    return user_search

## Session Level Operations

async def create_session(req):
    db = get_db()
    session_uuid = str(uuid.uuid4())
    await db.sessions.insert_one({"session_id": session_uuid, "email": req.email,"messages": jsonable_encoder(req.messages)})   
    return {"status_code": 200, "id": session_uuid}

async def update_session(req):
    db = get_db()
    session = db.sessions.find_one({"session_id": req.session_id})
    if session:
        await db.sessions.update_one(
            {"session_id": req.session_id}, 
            {"$set": {"messages": jsonable_encoder(req.messages)}}
        )
    else:
        raise ValueError(f"Session with session_id {req['session_id']} not found.")

async def get_user_sessions(email):
    db = get_db()
    sessions = await db.sessions.find_many({"email": email})
    return sessions

async def get_session(session_id):
    db = get_db()
    session = await db.sessions.find_one({"session_id": session_id})
    return session

async def get_messages(session_id):
    session = await get_session(session_id)
    return session['messages']


