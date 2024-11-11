# app/routers/search.py
from fastapi import APIRouter, Query, HTTPException
from utils.langchain import get_recommendations, search_movies
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
    date_range: list[str] = Query(default=[])
):
    results = search_movies_in_mysql(title, keywords, cast, crew, date_range)
    return results

@router.get("/recommendations/")
async def recommendations(email: str, library_bool: bool, exclusive: bool):
    recommendations = await get_recommendations(email, library_bool, exclusive)
    return recommendations