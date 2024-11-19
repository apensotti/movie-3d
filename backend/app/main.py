from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from sentence_transformers import SentenceTransformer
import faiss
import json
import re
import numpy as np
import random
from ast import literal_eval
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import asyncio
import uuid
from dotenv import load_dotenv
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from pymongo.mongo_client import MongoClient
from pydantic import BaseModel
from models.schema import user_serialization, message_serialization, all_sessions, all_users
from fastapi.encoders import jsonable_encoder
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import SON
from utils.common import get_selected_movies, get_genres, generate_graph_data, get_movie, get_movies
from utils.langchain import split_into_sentences, get_st_embeddings, faissvdb, search_movies
from utils.mongodb import get_db, ping_mongodb, validate_user, get_messages
from services.chat_service import handle_chat
from typing import List, Dict
from routers import chat, search, sessions, data, users

app = FastAPI()
db = get_db()

load_dotenv()
ping_mongodb()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://localhost:3001",
                    "*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(chat.router)
app.include_router(search.router)
app.include_router(sessions.router)
app.include_router(data.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Movie Wizard's API!"}

# @app.get("/users/")
# async def get_user(email: str):
#     user = await db.users.find_one({"email": email})
#     return user_serialization(user)

# @app.get("/all_users/")
# async def get_all_users():
#     users = db.users.find()
#     return all_users(users)

# @app.post("/create_user/")
# async def create_user(user: user):
#     try:
#         user_match = await db.users.find_one({"email": user.email})
#         if user_match:
#             return {"status_code": 400, "error": "User already exists"}

#         user_data = jsonable_encoder(user)
#         resp = await db.users.insert_one(user_data)

#         return {"status_code": 200, "id": str(resp.inserted_id)}
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return {"status_code": 500, "error": "An error occurred"}
