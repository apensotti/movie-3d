import { session } from "./Sessions";
import { SessionSchema } from "./Sessions";
import  mongoose, { Schema, model } from  "mongoose";

export interface User {
    _id: string;
    email: string;
    password: string;
  }

const UserSchema = new Schema<User>({
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: true
    }
  }
);

const  User  =  mongoose.models?.User  ||  model<User>('User', UserSchema);
export  default  User;