from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import faiss
import json
import re
import numpy as np

app = FastAPI()

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
index = faiss.read_index('data/index.bin')

# Load data (movies.json)
with open('data/movies.json', 'r') as f:
    movies = json.load(f)

def split_into_sentences(paragraph):
    # Regular expression to split by sentence-ending punctuation
    sentences = re.split(r'(?<=[.!?]) +', paragraph.strip())
    return sentences

def get_st_embeddings(text, model, tokenizer):
    inputs = model.encode(text, convert_to_numpy=True)
    return inputs

# Load FAISS index (index.bin)
index = faiss.read_index('data/index.bin')

@app.get("/")
def read_root():
    return {"message": "Welcom to Movie Wizard's Similarity Search API!"}

@app.get("/search/")
def search(query: str):
    sentences = split_into_sentences(query)
    embedding = np.array([get_st_embeddings(sentence, model) for sentence in sentences])
    D, I = index.search(embedding, k=10)
    results = [movies[i]['imdb_id'] for i in I[0]]
    return {"results": results}

@app.get("/embed/")
def embed_text(text: str):
    embeddings = model2.encode([text])
    return {"embeddings": embeddings.tolist()}