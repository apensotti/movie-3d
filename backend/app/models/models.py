from pydantic import BaseModel

class message(BaseModel):
    content: str
    additional_kwargs: dict
    response_metadata: dict
    type: str
    name: str
    id: str
    example: bool

class session(BaseModel):
    session_id: str
    email: str
    messages: list[message]

class user(BaseModel):
    password: str
    email: str
    image: str

class ChatRequest(BaseModel):
    messages: list[dict]
    email: str
    session_id: str



