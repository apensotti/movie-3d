import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions, User, getServerSession } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from "../../../../lib/prisma";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from 'next/navigation';

export const options: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                  label: "Email",
                  type: "email",
                  placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
              },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password)
                  return null;
        
                const dbUser = await prisma.user.findFirst({
                  where: { email: credentials.email },
                });
        
                //Verify Password here
                //We are going to use a simple === operator
                //In production DB, passwords should be encrypted using something like bcrypt...
                if (dbUser && dbUser.password === credentials.password) {
                  const { password, createdAt, id, ...dbUserWithoutPassword } = dbUser;
                  return dbUserWithoutPassword as User;
                }
        
                return null;
              },
        })
    ],
}

