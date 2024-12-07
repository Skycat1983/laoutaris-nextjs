import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeUser } from "../server/user/data-fetching/authenticateUser";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../mongo";
import { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";

// ! important
// https://www.youtube.com/watch?v=3bI5js0PVu0&ab_channel=NoorMohammad

// this is necessary to ensure data integrity. otherwise the user object created by the adapter will not have the custom fields
//! important: first time sign in is fine, second time sign in (so actual sign in, not create user), fails
const CustomMongoDBAdapter = (client) => {
  const baseAdapter = MongoDBAdapter(client);

  return {
    ...baseAdapter,
    async createUser(profile) {
      console.log("Custom createUser called:", profile);

      const customUser = {
        ...profile,
        username: profile.name,
        role: "user",
        watchlist: [],
        favourites: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (!baseAdapter.createUser) {
        throw new Error("createUser is not implemented by the base adapter");
      }

      const user = await baseAdapter.createUser(customUser);

      if (!user) {
        return null;
      }

      console.log("Custom user created:", user);
      return user;
    },
  };
};

export const authOptions = {
  // adapter: MongoDBAdapter(clientPromise) as Adapter,
  adapter: CustomMongoDBAdapter(clientPromise) as Adapter,
  session: {
    strategy: "jwt" as SessionStrategy,
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
      authorize: authorizeUser,
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
  callbacks: {
    //! used to determine if a user is allowed to sign in. NOT for reformatting the user object
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
        // return '/unauthorized'
      }
    },

    //! The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Parse the URL to determine the action
      const urlObj = new URL(url, baseUrl);
      const path = urlObj.pathname;
      // Determine if it's a sign-in callback
      if (path === "/api/auth/signin") {
        // Redirect to dashboard after sign-in
        return `${baseUrl}/dashboard`;
      }

      // Determine if it's a sign-out callback
      if (path === "/api/auth/signout") {
        return `${baseUrl}`;
      }
      // Default behavior: allow the redirect
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    //! the jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback
    async jwt({ token, user, account, profile, isNewUser }) {
      // !
      if (user) {
        token.id = user.id;
      }
      // console.log("token in jwt authOptions", token);

      return token;
    },
    async session({ session, user, token }) {
      session.user.id = token.id;
      // console.log("session in session authOptions", session);
      return session;
    },
  },
};
