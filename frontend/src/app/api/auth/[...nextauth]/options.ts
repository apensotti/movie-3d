// import GoogleProvider from 'next-auth/providers/google'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { MongoDBAdapter } from "@auth/mongodb-adapter"
// import User from '@/lib/models/User';
// import type { NextAuthOptions } from "next-auth";
// import client from '@/lib/mongodb';
// import credentials from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";

// export const options: NextAuthOptions = {
//     providers: [
//       GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID as string,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       }),
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: {
//                   label: "Email",
//                   type: "email",
//                   placeholder: "example@example.com",
//                 },
//                 password: { label: "Password", type: "password" },
//               },
//             async authorize(credentials) {await client.connect();
//               const user = await User.findOne({
//                 email: credentials?.email,
//               }).select("+password");
      
//               if (!user) throw new Error("Wrong Email");
      
//               const passwordMatch = await bcrypt.compare(
//                 credentials!.password,
//                 user.password
//               );
      
//               if (!passwordMatch) throw new Error("Wrong Password");
//               return user;
            
//               },
//         })
//     ],
//     session: {
//         strategy: "jwt",
//         maxAge: 30 * 24 * 60 * 60,
//     },
//     pages: {
//         signIn: "/login",
//     },
//     callbacks: {
//         async jwt({token, user}) {
//             if (user) {
//                 return {...token, id: user.email};
//             }
//             return token;
//         },
//         async session({session, token}) {
//           console.log('session callback', {session, token});
//           return {
//             ...session,
//             user: {
//               ...session.user,
//               id: token.id as string,
//             }
//           }
            
//         },
//     },
// }