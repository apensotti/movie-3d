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


## Prompt Template for Chat History
def mw_chat_chain(query: str, messages: list):

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
    Given the following movie context, I would like you to return the title,
    show it's directed by, when it was released, and summarize the plot,
    the plot of the movie. If you are not sure, you can ask me for more
    information. If the question is realated to anything other than movies or celebrities,
    please respond with, "I'm sorry, my knowlege is limited to movies and celebrities."
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


    result = rag_chain.invoke({"input": query, "chat_history": messages})

    messages.append(HumanMessage(content=query))
    messages.append(SystemMessage(content=result["answer"]))

    return messages