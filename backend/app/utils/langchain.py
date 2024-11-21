import os
import re
from sentence_transformers import SentenceTransformer
import numpy as np
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import json
import pandas as pd
from utils.mongodb import get_library, get_watchlist
load_dotenv()

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')


llm = ChatOpenAI(model="gpt-4o", streaming=True)
llm_embeddings = OpenAIEmbeddings(model='text-embedding-3-small')
vdb = FAISS.load_local('data/description/', llm_embeddings, allow_dangerous_deserialization=True)
recommendation_vdb = FAISS.load_local('data/recommendation/', llm_embeddings, allow_dangerous_deserialization=True)

with open('data/movies.json', 'r') as file:
    data_movies = json.load(file)

#NLP
def split_into_sentences(paragraph):
    sentences = re.split(r'(?<=[.!?]) +', paragraph.strip())
    return sentences

def get_st_embeddings(text, model: SentenceTransformer):
    inputs = model.encode(text, convert_to_numpy=True)
    return inputs

def faissvdb(k):
    retriever = vdb.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k},
    )
    return retriever

def faissvdb_recommendations(k):
    retriever = recommendation_vdb.as_retriever(
        search_type="mmr",
        search_kwargs={"k": k, "fetch_k": k,"filter": {"language": "en"}},
    )
    return retriever

## Faiss Vector Database
import json
def search_movies(query, k):
    results = faissvdb(k).invoke(query)

    movie_ids = []        
    movie_lookup = {movie['imdb_id']: movie for movie in data_movies}
    
    for result in results:
        movie_data = movie_lookup.get(result.metadata['imdb_id'])
        if movie_data:
            movie_ids.append(movie_data['imdb_id'])
            
            if movie_data.get('belongs_to_collection') and isinstance(movie_data['belongs_to_collection'], dict):
                collection_id = movie_data['belongs_to_collection'].get('id')
                if collection_id:
                    collection_movie_ids = [
                        movie['imdb_id'] for movie in data_movies
                        if movie.get('belongs_to_collection') and 
                        isinstance(movie['belongs_to_collection'], dict) and
                        movie['belongs_to_collection'].get('id') == collection_id
                    ]
                    movie_ids.extend(collection_movie_ids)

    unique_ids = []
    seen = set()
    for movie_id in movie_ids:
        if movie_id not in seen:
            unique_ids.append(movie_id)
            seen.add(movie_id)

    return unique_ids


def rag_chain():
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference movies in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, just "
        "reformulate it if needed and otherwise return it as is."
        )

    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    retriever = faissvdb(k=10)

    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    qa_system_prompt = ('''                    
    You are given a few similar movies to the users query. I would like you
    to first say Here is a few movies that match your description. Then list the movies
    the user will then choose one of the movies and ask for more information about the movie.
    
    I would also like you to respond in this markdown format:
    Here are a few movies that match your description: \n\n
    ### Movie Title: \n
    Description: \n
    ### Movie Title: \n
    Description: \n
    ### Movie Title: \n
    Description: \n\n
    Which movie would you like more information on? \n\n
    "
    \n\n
    {context}
                    
    '''
    )

    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    return rag_chain

## Prompt Template for Chat History
def mw_chat_chain(query: str, messages: list):

    chain = rag_chain()

    result = chain.invoke({"input": query, "chat_history": messages})

    messages.append(HumanMessage(content=query))
    messages.append(SystemMessage(content=result["answer"]))

    return messages


class ChatRequest():
    def __init__(self, query: str, messages: list):
        self.messages = messages
        self.query = query

    def return_messages(self):
        return self.messages

    def mw_chat_stream(self):
        full_message = ""
        
        chain = rag_chain()
    
        def generator():
            for chunck in chain.stream({"input": self.query, "chat_history": self.messages}):
                full_message += chunck["answer"]
                yield chunck
                
        self.messages.append(HumanMessage(content=self.query))
        self.messages.append(SystemMessage(content=full_message))
    
        return StreamingResponse(generator(), media_type='text/event-stream')

async def get_recommendations(email: str, library_bool: bool, exclusive: bool):
    data = pd.read_json('data/movies.json')

    library = await get_library(email)
    watchlist = await get_watchlist(email)

    keywords_set = set()
    genres_set = set()
    popularity_list = list()

    profile = ''

    if library_bool == True:
        movie_data = data[data['imdb_id'].isin(library)]    
        for index, row in movie_data.iterrows():
            keywords_set.update(row['keywords'])
            genres_set.update(row['genres'])
            popularity_list.append(row['popularity'])
        profile = " ".join(list(keywords_set)) + " ".join(list(genres_set)) + " " + str(np.mean(popularity_list))
        
    elif library_bool == False:
        movie_data = data[data['imdb_id'].isin(watchlist)]
        for index, row in movie_data.iterrows():
            keywords_set.update(row['keywords'])
            genres_set.update(row['genres'])
            popularity_list.append(row['popularity'])
        profile = " ".join(list(keywords_set)) + " ".join(list(genres_set)) + " " + str(np.mean(popularity_list))

    movies = faissvdb_recommendations(k=50).invoke(profile)

    if library_bool:
        if exclusive:
            movies = [movie for movie in movies if movie.metadata['imdb_id'] not in library]
        else:
            movies = [movie for movie in movies if movie.metadata['imdb_id'] not in library]
    else:
        if exclusive:
            movies = [movie for movie in movies if movie.metadata['imdb_id'] not in watchlist]
        else:
            movies = [movie for movie in movies if movie.metadata['imdb_id'] not in watchlist]

    ids = [movie.metadata['imdb_id'] for movie in movies]

    return ids