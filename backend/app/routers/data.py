from fastapi import APIRouter
from utils.common import generate_graph_data, get_movie, get_movies

router = APIRouter(prefix="/data", tags=["Data"])

@router.get("/generate_graph/")
def generate_graph(ids: str):
    return generate_graph_data(ids)

@router.get("/get_movies/")
def get_movies():
    return get_movies()

@router.get("/get_movie/")
def get_movie(imdb_id: str):
    return get_movie(imdb_id)