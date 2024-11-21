from ast import literal_eval
import json
import mysql.connector
import re
import random
from datetime import datetime

## Data
with open('data/movies.json', 'r') as f:
    movies = json.load(f)

with open('data/365_movies.json', 'r') as f:
    daily_movies = json.load(f)

def get_movies():
    return movies

def get_movie(imdb_id: str):
    movie = [movie for movie in movies if movie['imdb_id'] == imdb_id]
    return movie

## 3D Graph Data

def get_selected_movies(ids):
    data = [movie for movie in movies if str(movie['imdb_id']) in ids and 'genres' in movie and movie['genres']]
    return data

def get_genres(ids):
    genres = []
    data = [d for d in movies if str(d['imdb_id']) in ids and 'genres' in d and d['genres']]
    for row in data:
        genres.extend(row['genres'])
    return list(set(genres))

def generate_graph_data(ids: list[str]):
    imdb_ids = ids

    nodes = []
    links = []

    movies = get_selected_movies(imdb_ids)
    
    # First collect all genres that have at least one movie
    used_genres = set()
    for movie in movies:
        if 'genres' in movie and movie['genres']:
            for genre in movie['genres']:
                used_genres.add(genre)

    # Only add genre nodes that will have connections
    for genre in used_genres:
        node = {"id": genre, "title": genre, "size": 1}
        nodes.append(node)

    # Add movie nodes and links
    for movie in movies:
        if 'genres' in movie and movie['genres']:
            movie_id = str(movie['imdb_id'])
            nodes.append({"id": movie_id, "title": movie['title'], "size": movie['popularity']})
            for genre in movie['genres']:
                links.append({"source": genre, "target": movie_id})

    return {"nodes": nodes, "links": links}



def search_movies_in_mysql(title='', keywords=[], cast=[], crew=[], date_range=[], vote_average={}, popularity={}, limit=0):
    # Establish a connection to the MySQL database
    connection = mysql.connector.connect(
        host="mysql",
        port=3306,
        user="root",
        password="rootpassword",
        database="movies"
    )

    # Create a cursor object to interact with the database
    cursor = connection.cursor(dictionary=True)

    keyword_filter = ' OR '.join([f"LOWER(keywords) LIKE '%{keyword.lower()}%'" for keyword in keywords])
    cast_filter = ' OR '.join([f"LOWER(cast) LIKE '%{actor.lower()}%'" for actor in cast])
    crew_filter = ' OR '.join([f"LOWER(crew) LIKE '%{member.lower()}%'" for member in crew])
    processed_title = re.sub(r'[^a-zA-Z0-9\s]', '', title.lower())

    sql2 = 'SELECT imdb_id FROM movies'
    conditions = []

    if title:
        conditions.append(f"(LOWER(title) LIKE '%{title}%' OR LOWER(original_title) LIKE '%{title}%' OR processed_title LIKE '%{title}%')")
    if keywords:
        conditions.append(f"({keyword_filter})")
    if cast:
        conditions.append(f"({cast_filter})")
    if crew:
        conditions.append(f"({crew_filter})")
    if date_range:
        start_date, end_date = date_range
        conditions.append(f"release_date BETWEEN '{start_date}' AND '{end_date}'")
    if vote_average and (vote_average.get("min") is not None or vote_average.get("max") is not None):
        if vote_average.get("min") is not None:
            conditions.append(f"vote_average >= {vote_average['min']}")
        if vote_average.get("max") is not None:
            conditions.append(f"vote_average <= {vote_average['max']}")
    if popularity and (popularity.get("min") is not None or popularity.get("max") is not None):
        if popularity.get("min") is not None:
            conditions.append(f"popularity >= {popularity['min']}")
        if popularity.get("max") is not None:
            conditions.append(f"popularity <= {popularity['max']}")
    if conditions:
        sql2 += ' WHERE ' + ' AND '.join(conditions)
    if limit:
        sql2 += f' LIMIT {limit}'
    if limit == None:
        sql2 += ' LIMIT 100'

    
    cursor.execute(sql2)
    results = cursor.fetchall()

    connection.close()
    return [result['imdb_id'] for result in results]


def get_daily_movie():
    today = datetime.now().strftime("%Y-%m-%d")
    for movie in daily_movies:
        if movie['date'] == today:
            return movie['imdb_id']
    return None