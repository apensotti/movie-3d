// class message(BaseModel):
//     content: str
//     additional_kwargs: dict
//     response_metadata: dict
//     type: str
//     name: str
//     id: str
//     example: bool

// class session(BaseModel):
//     session_id: str
//     messages: list[message]

import  mongoose, { Schema, model } from  "mongoose";

export interface message{
    content: string;
    additional_kwargs: object;
    response_metadata: object;
    type: string;
    name: string;
    id: string;
    example: boolean;
}

export interface session{
    session_id: string;
    messages: message[];
}

const MessageSchema = new Schema<message>({
    content: {
        type: String,
        required: [true, "Content is required"]
        },
    additional_kwargs: {
        type: Object,
        default: {}
    },
    response_metadata: {
        type: Object,
        default: {}
    },
    type: {
        type: String,
        required: [false, "Type is required"]
    },
    name: {
        type: String,
        required: [false, "Name is required"]
    },
    id: {
        type: String,
        required: [false, "Id is required"]
    },
    example: {
        type: Boolean,
        required: [false, "Example is required"]
    }
});

export const SessionSchema = new Schema<session>({
    session_id: {
        type: String,
        required: [true, "Session ID is required"]
    },
    messages: {
        type: [MessageSchema],
        default: []
    }
});