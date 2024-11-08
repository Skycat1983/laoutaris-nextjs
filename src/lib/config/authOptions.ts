import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeUser } from "../server/user/data-fetching/authenticateUser";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "../mongo";

// ! important
// https://www.youtube.com/watch?v=3bI5js0PVu0&ab_channel=NoorMohammad

export const authOptions = {
  adapter: MongoDBAdapter(client),
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
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      //   console.log("AuthOptions signIn Callback - user:", user);
      //   console.log("AuthOptions signIn Callback - account:", account);
      //   console.log("AuthOptions signIn Callback - profile:", profile);
      //   console.log("AuthOptions signIn Callback - email:", email);
      //   console.log("AuthOptions signIn Callback - credentials:", credentials);
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
        // return '/unauthorized'
      }
    },
    //The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Parse the URL to determine the action
      const urlObj = new URL(url, baseUrl);
      const path = urlObj.pathname;
      //   console.log("Redirect URL in authOptions:", url);
      //   console.log("Base URL in authOptions:", baseUrl);
      //   console.log("urlObj in authOptions:", urlObj);
      //   console.log("path in authOptions:", path);

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
      //   console.log("AuthOptions jwt Callback - token:", token);
      //   console.log("AuthOptions jwt Callback - user:", user);
      //   console.log("AuthOptions jwt Callback - account:", account);
      return token;
    },
    async session({ session, user, token }) {
      //   console.log("session in authOptions", session);
      //   console.log("user in authOptions", user);
      //   console.log("token in authOptions", token);
      return session;
    },
  },
};

// pages: {
// signIn: "api/auth/",
// signUp: "/register",
// signOut: "api/auth/signout",
// error: "/auth/error", // Error code passed in query string as ?error=
// },
