import re
from utils.langchain import mw_chat_chain
from utils.mongodb import get_db, get_messages, create_session, update_session
from fastapi.encoders import jsonable_encoder


async def handle_chat(req):
    # Extract the query from the request
    query = req.messages[-1]['content']
    query = re.sub(r'%27', '"', query)
    query = re.sub(r'%20', ' ', query)
    query = str(query)

    # If the session id is empty, set messages to empty, 
    # else get the current session's messages
    if req.session_id == "":
        req.messages = []
    else:
        req.messages = get_messages(req.session_id)

    # Pass the latest query and the session messages to the chat chain
    messages = mw_chat_chain(query, req.messages)

    # If the session id is empty, create a new session,
    # else update the current session with the new messages
    if req.session_id == "":
        await create_session(req)
    else:
        await update_session(req)
    
    return messages
