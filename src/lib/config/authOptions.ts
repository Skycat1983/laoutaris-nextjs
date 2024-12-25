import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeUser } from "../server/user/data-fetching/authenticateUser";
import clientPromise from "../mongo";
import { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";
import { CustomMongoDBAdapter } from "../mongo/adapter";

// ! important
// https://www.youtube.com/watch?v=3bI5js0PVu0&ab_channel=NoorMohammad

export const authOptions = {
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
    //? here can customise the token contents
    async jwt({ token, user, account, profile, isNewUser }) {
      // like a keycard that is given to the user to access the building
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log("jwt in authOptions", isNewUser);
      // console.log("token in jwt authOptions", token);

      return token;
    },
    //? here can customise the session contents
    //! this is not stored. It is only used to create the session object that is returned to the client
    async session({ session, user, token }) {
      // like the building's security system that checks the keycard
      session.user.id = token.id;
      session.user.role = token.role;
      console.log("session in authOptions", session);
      return session;
    },
  },
};
// session is created from the jwt.
