"use server"
import client from "@/lib/mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const register = async (values: any) => {
  const { email, password, name } = values;

  try {
      const cliet = await clientPromise;
      const userFound = await User.findOne({ email });
      if(userFound){
          return {
              error: 'Email already exists!'
          }
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();

  }catch(e){
      console.log(e);
  }
}
