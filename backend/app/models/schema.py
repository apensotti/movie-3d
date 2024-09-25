def user_serialization(user) -> dict:
    return {
        "email": user.email,
        "password": user.password
    }

def message_serialization(message) -> dict:
    return {
        "content": message.content,
        "additional_kwargs": message.additional_kwargs,
        "response_metadata": message.response_metadata,
        "type": message.type,
        "name": message.name,
        "id": message.id,
        "example": message.example
    }

def all_sessions(sessions) -> dict:
    return [message_serialization(message) for message in sessions]

def all_users(users) -> dict:
    return [user_serialization(user) for user in users]

