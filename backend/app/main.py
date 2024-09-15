from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import faiss
import json
import re
import numpy as np
from ast import literal_eval
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Allow all origins, or specify only allowed domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001", "*"],  # Or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
index = faiss.read_index('data/index.bin')

with open('data/metadata.json', 'r') as f:
    metadata = json.load(f)

with open('data/movies.json', 'r') as f:
    movies = json.load(f)


def split_into_sentences(paragraph):
    # Regular expression to split by sentence-ending punctuation
    sentences = re.split(r'(?<=[.!?]) +', paragraph.strip())
    return sentences

def get_st_embeddings(text, model):
    inputs = model.encode(text, convert_to_numpy=True)
    return inputs

def get_selected_movies(ids):
    data = [movie for movie in movies if movie['imdb_id'] in ids]
    return data

def get_genres(ids):
    genres = []
    data = [d for d in movies if d['imdb_id'] in ids]
    for row in data:
        genres.extend(literal_eval(row['genres']))
    return list(set(genres))



# Load FAISS index (index.bin)
index = faiss.read_index('data/index.bin')

# Load metadata
with open('data/metadata.json', 'r') as f:
    metadata = json.load(f)


@app.get("/")
def read_root():
    return {"message": "Welcome to Movie Wizard's Similarity Search API!"}

@app.get("/generate_graph/")
def generate_graph(ids: str):
    ids = literal_eval(ids)

    nodes = []
    links = []

    genres = get_genres(ids)
    movies = get_selected_movies(ids)

    for genre in set(genres):
        node = {"id": genre, "title": genre}
        nodes.append(node)

    for i,row in enumerate(movies):
        try:
            prev_row = movies.iloc[i-1]
            links.append({"source": prev_row['imdb_id'], "target": row['imdb_id']})
        except:
            pass
        for genre in literal_eval((row['genres'])):
            links.append({"source": genre, "target": row['imdb_id']})
        nodes.append({"id": row['imdb_id'], "title": row['title']})

    return {"nodes": nodes, "links": links}

@app.get("/search/")
def search(query: str, k: int = 50):
    data = pd.read_csv('data/movies.csv')
    sentences = split_into_sentences(query)
    embedding = np.array([get_st_embeddings(sentence, model) for sentence in sentences])
    D, I = index.search(embedding, k=k)
    ids = [metadata[i]['imdb_id'] for i in I[0]]
    results = data[data['imdb_id'].isin(ids)]
    results_sorted = list(results.sort_values(by=['popularity'], ascending=False)['imdb_id'].values)
    return {"results": results_sorted}

@app.get("/movies/")
def get_movies():
    return movies

@app.get("/get_movie/")
def get_movie(imdb_id: str):
    movie = [movie for movie in movies if movie['imdb_id'] == imdb_id]
    return movie
