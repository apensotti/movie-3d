# app/routers/search.py
from fastapi import APIRouter, Query, HTTPException
from utils.langchain import search_movies
from utils.common import search_movies_in_mysql

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("/similarity/")
def search(query: str, k: int = 50):
    movies = search_movies(query, k)
    ids = [movie['imdb_id'] for movie in movies]
    return list(set(ids))

@router.get("/movies/")
def search_mysql(
    title: str = '',
    keywords: list[str] = Query(default=[]),
    cast: list[str] = Query(default=[]),
    crew: list[str] = Query(default=[]),
    date_range: list[str] = Query(default=[]),
    page: int = 1,
    limit: int = 10
):
    if page < 1 or limit < 1:
        raise HTTPException(status_code=400, detail="Page and limit must be positive integers.")
    
    results = search_movies_in_mysql(title, keywords, cast, crew, date_range, page, limit)
    return results
