from ast import literal_eval
import json
import mysql.connector
import re

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

def search_movies_in_mysql(title='', keywords=[], cast=[], crew=[], date_range=[], page=1, limit=10):
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

    sql = 'SELECT imdb_id FROM movies ORDER BY RAND() LIMIT 100'
    sql2 = 'SELECT imdb_id FROM movies'
    conditions = []

    if title:
        conditions.append(f"(LOWER(title) LIKE '%{processed_title}%' OR LOWER(original_title) LIKE '%{processed_title}%')")
    if keywords:
        conditions.append(f"({keyword_filter})")
    if cast:
        conditions.append(f"({cast_filter})")
    if crew:
        conditions.append(f"({crew_filter})")
    if date_range:
        start_date, end_date = date_range
        conditions.append(f"release_date BETWEEN '{start_date}' AND '{end_date}'")

    if conditions:
        sql2 += ' WHERE ' + ' AND '.join(conditions)
    
    offset = (page - 1) * limit
    sql2 += f' LIMIT {limit} OFFSET {offset}'
    
    cursor.execute(sql2)
    results = cursor.fetchall()

    connection.close()
    return [result['imdb_id'] for result in results]
