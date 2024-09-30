"use server"

import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const register = async (values: any) => {
  const { email, password, name } = values;

  try {
    // Establish MongoDB connection
    const client = await clientPromise;
    const db = client.db("mw_users");

    // Check if user with the provided email already exists
    const userFound = await db.collection("users").findOne({ email });
    if (userFound) {
      return {
        error: "Email already exists!"
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      emailVerified: null, // for NextAuth compatibility
    };

    // Insert the new user into the "users" collection
    await db.collection("users").insertOne(newUser);

    // Return a success message or the user data
    return { success: true, user: newUser };

  } catch (e) {
    console.error(e);
    return {
      error: "Something went wrong while registering!"
    };
  }
};
