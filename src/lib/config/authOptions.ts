import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";
import { DefaultSession, DefaultUser, SessionStrategy } from "next-auth";
import { CustomMongoDBAdapter } from "@/lib/db/adapter";
import { clientPromise } from "@/lib/db";
import { authCallbacks } from "./authCallbacks";

// ! important
// https://www.youtube.com/watch?v=3bI5js0PVu0&ab_channel=NoorMohammad

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; // Add the role property
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}

export const authOptions = {
  adapter: CustomMongoDBAdapter(clientPromise) as Adapter,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "your email",
      credentials: {
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
      authorize: async (credentials, req) => {
        const { authorizeUser } = await import("../actions/authenticateUser");
        return authorizeUser(credentials, req);
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: authCallbacks,
};
