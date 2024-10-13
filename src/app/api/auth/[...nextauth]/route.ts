import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/config/authOptions";
import type { NextAuthOptions } from "next-auth";

export const handler = NextAuth(authOptions as NextAuthOptions);

export { handler as GET, handler as POST };

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "your email",
//       credentials: {
//         // email: { label: "Email", type: "email", name: "email", id: "email" },
//         username: {
//           label: "Username",
//           type: "text",
//           name: "username",
//           id: "username",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//           name: "password",
//           id: "password",
//         },
//       },
//       authorize: authorizeUser,
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID ?? "",
//       clientSecret: process.env.GITHUB_SECRET ?? "",
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }) {
//       return true;
//     },
//     async redirect({ url, baseUrl }) {
//       return baseUrl;
//     },
//     async session({ session, user, token }) {
//       return session;
//     },
//     async jwt({ token, user, account, profile, isNewUser }) {
//       return token;
//     },
//   },
// };
