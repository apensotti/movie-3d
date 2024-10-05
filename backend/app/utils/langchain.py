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

llm = ChatOpenAI(model="gpt-4o", streaming=True)
llm_embeddings = OpenAIEmbeddings(model='text-embedding-3-small')
vdb = FAISS.load_local('data/faissvdb/', llm_embeddings, allow_dangerous_deserialization=True)

#NLP
def split_into_sentences(paragraph):
    sentences = re.split(r'(?<=[.!?]) +', paragraph.strip())
    return sentences

def get_st_embeddings(text, model: SentenceTransformer):
    inputs = model.encode(text, convert_to_numpy=True)
    return inputs


## Faiss Vector Database
def search_movies(query, k):
    
    results = faissvdb(k).invoke(query)

    movies = []
    for result in results:
        movies.append(result.metadata)

    return movies

def faissvdb(k):
    retriever = vdb.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k},
    )
    return retriever

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