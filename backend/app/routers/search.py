# app/routers/search.py
from fastapi import APIRouter
from utils.langchain import search_movies

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("/")
def search(query: str, k: int = 50):
    movies = search_movies(query, k)
    ids = [movie['imdb_id'] for movie in movies]
    return list(set(ids))
