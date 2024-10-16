from fastapi import APIRouter, HTTPException
from typing import List
from models.models import user
from utils.mongodb import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{email}/movie-status/{imdb_id}")
async def get_movie_status(email: str, imdb_id: str):
    db = get_db()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    library = user.get("library", [])
    watchlist = user.get("watchlist", [])
    
    return {
        "inLibrary": imdb_id in library,
        "inWatchlist": imdb_id in watchlist
    }

@router.post("/{email}/library/{action}")
async def update_user_library(email: str, action: str, movie: dict):
    db = get_db()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    library = set(user.get("library", []))
    watchlist = set(user.get("watchlist", []))
    
    if action == "add":
        library.add(movie["imdbID"])
        watchlist.discard(movie["imdbID"])
    elif action == "remove":
        library.discard(movie["imdbID"])
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"library": list(library), "watchlist": list(watchlist)}}
    )
    return {"message": "Library updated successfully"}

@router.post("/{email}/watchlist/{action}")
async def update_user_watchlist(email: str, action: str, movie: dict):
    db = get_db()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    watchlist = set(user.get("watchlist", []))
    library = set(user.get("library", []))
    
    if action == "add":
        watchlist.add(movie["imdbID"])
        library.discard(movie["imdbID"])
    elif action == "remove":
        watchlist.discard(movie["imdbID"])
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"watchlist": list(watchlist), "library": list(library)}}
    )
    return {"message": "Watchlist updated successfully"}

@router.get("/{email}/library")
async def get_user_library(email: str):
    db = get_db()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    library = user.get("library", [])
    return library

@router.get("/{email}/watchlist")
async def get_user_watchlist(email: str):
    db = get_db()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    watchlist = user.get("watchlist", [])
    return watchlist
