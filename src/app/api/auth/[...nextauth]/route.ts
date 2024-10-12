import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeUser } from "@/lib/server/user/data-fetching/authenticateUser";

export const authOptions = {
  // pages: {
  //   signIn: "/login",
  //   signUp: "/register",
  //   // error: "/auth/error", // Error code passed in query string as ?error=
  // },
  providers: [
    CredentialsProvider({
      name: "your email",
      credentials: {
        // email: { label: "Email", type: "email", name: "email", id: "email" },
        username: {
          label: "Username",
          type: "text",
          name: "username",
          id: "username",
        },
        password: {
          label: "Password",
          type: "password",
          name: "password",
          id: "password",
        },
      },
      authorize: authorizeUser,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
