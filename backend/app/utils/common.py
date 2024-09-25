from ast import literal_eval
import json

## Data
with open('data/movies.json', 'r') as f:
    movies = json.load(f)

def get_movies():
    return movies

def get_movie(imdb_id: str):
    movie = [movie for movie in movies if movie['imdb_id'] == imdb_id]
    return movie

## 3D Graph Data

def get_selected_movies(ids):
    data = [movie for movie in movies if movie['imdb_id'] in ids]
    return data

def get_genres(ids):
    genres = []
    data = [d for d in movies if d['imdb_id'] in ids]
    for row in data:
        genres.extend(literal_eval(row['genres']))
    return list(set(genres))

def generate_graph_data(ids=None):
    ids = literal_eval(ids)

    nodes = []
    links = []

    genres = get_genres(ids)
    movies = get_selected_movies(ids)

    for genre in set(genres):
        node = {"id": genre, "title": genre, "size": 1}
        nodes.append(node)

    for i,row in enumerate(movies):
        try:
            prev_row = movies.iloc[i-1]
            links.append({"source": prev_row['imdb_id'], "target": row['imdb_id']})
        except:
            pass
        for genre in literal_eval((row['genres'])):
            links.append({"source": genre, "target": row['imdb_id']})

        nodes.append({"id": row['imdb_id'], "title": row['title'], "size": row['popularity']})

    return {"nodes": nodes, "links": links}