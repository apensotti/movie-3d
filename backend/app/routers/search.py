# app/routers/search.py
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict
from pydantic import BaseModel
from utils.langchain import get_recommendations, search_movies
from utils.common import search_movies_in_mysql

router = APIRouter(prefix="/search", tags=["Search"])

class RangeFilter(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None

@router.get("/similarity/")
def search(query: str, k: int = 50):
    movies = search_movies(query, k)
    ids = [movie['imdb_id'] for movie in movies]
    return list(set(ids))

@router.get("/movies/")
async def search_mysql(
    title: str = '',
    keywords: List[str] = Query(default=[]),
    cast: List[str] = Query(default=[]),
    crew: List[str] = Query(default=[]),
    date_range: List[str] = Query(default=[]),
    vote_average_min: Optional[float] = Query(default=None),
    vote_average_max: Optional[float] = Query(default=None),
    popularity_min: Optional[float] = Query(default=None),
    popularity_max: Optional[float] = Query(default=None),
    limit: Optional[int] = Query(default=None),
):
    vote_average = {
        "min": vote_average_min,
        "max": vote_average_max
    }
    
    popularity = {
        "min": popularity_min,
        "max": popularity_max
    }
    
    results = search_movies_in_mysql(
        title, 
        keywords, 
        cast, 
        crew, 
        date_range,
        vote_average,
        popularity,
        limit
    )
    return results

@router.get("/recommendations/")
async def recommendations(email: str, library_bool: bool, exclusive: bool):
    recommendations = await get_recommendations(email, library_bool, exclusive)
    return recommendations