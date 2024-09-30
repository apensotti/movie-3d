import re
from utils.langchain import mw_chat_chain, ChatRequest, rag_chain
from utils.mongodb import get_db, get_messages, create_session, update_session
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage, SystemMessage, AIMessageChunk
import json

def get_query(req):
    query = req.messages[-1]['content']
    query = re.sub(r'%27', '"', query)
    query = re.sub(r'%20', ' ', query)
    query = str(query)
    return query

async def handle_chat(req):
    query = get_query(req)

    if req.session_id == "":
        req.messages = []
    else:
        req.messages = get_messages(req.session_id)

    messages = mw_chat_chain(query, req.messages)

    if req.session_id == "":
        await create_session(req)
    else:
        await update_session(req)

    return messages

class Chat:
    def __init__(self):
        self.session_id = ""
        self.messages = []
        self.full_message = ""
        self.query = ""

    async def handle_chat_stream(self, req):
        self.query = get_query(req)

        if req.session_id == "":
            self.messages = []
        else:
            self.messages = get_messages(req.session_id)

        chain = rag_chain()

        async def generator():
            async for chunk in chain.astream({"input": self.query, "chat_history": self.messages}):
                try:
                    answer = chunk.get("answer", "")
                    self.full_message += answer
                    yield str(answer)
                except Exception as e:
                    print(e)

        # Add the user query and the system's response to the chat history
        req.messages.append(HumanMessage(content=self.query))
        req.messages.append(SystemMessage(content=self.full_message))

        if req.session_id == "":
            await create_session(req)
        else:
            await update_session(req)

        # Return a StreamingResponse with properly formatted JSON chunks
        return StreamingResponse(generator(), media_type='text/plain')
