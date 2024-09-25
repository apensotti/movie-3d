import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from "../mongodb"; // MongoDB client promise
import bcrypt from "bcrypt";
import { redirect } from "next/dist/server/api-utils";

// Define the User interface to match your MongoDB schema and the expected NextAuth User
interface User {
  id: string;
  email: string;
  password: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/auth-success",
    error: "/auth/auth-error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("mw_users");

        // Find the user by email
        const userDoc = await db.collection("users").findOne(
          { email: credentials?.email },
          { projection: { _id: 1, email: 1, password: 1 } } // Include _id, email, and password
        );

        if (!userDoc) {
          throw new Error("Wrong Email");
        }

        // Compare the password
        const passwordMatch = await bcrypt.compare(
          credentials!.password as string,
          userDoc.password
        );

        if (!passwordMatch) {
          throw new Error("Wrong Password");
        }

        // Transform the MongoDB document into a NextAuth User object
        const user: User = {
          id: userDoc._id.toString(), // MongoDB ObjectId needs to be converted to a string
          email: userDoc.email,
          password: userDoc.password, // You can omit this in the returned object if you want
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Set the user ID in the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string; // Add user ID to the session
      return session;
    },
  },
});
