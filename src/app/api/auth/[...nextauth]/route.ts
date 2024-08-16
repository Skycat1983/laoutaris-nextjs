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

// The credentials is used to generate a suitable form on the sign in page.
// You can specify whatever fields you are expecting to be submitted.
// e.g. domain, username, password, 2FA token, etc.
// You can pass any HTML attribute to the <input> tag through the object.
// async authorize(credentials, req) {
//   // You need to provide your own logic here that takes the credentials
//   // submitted and returns either a object representing a user or value
//   // that is false/null if the credentials are invalid.
//   // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
//   // You can also use the `req` object to obtain additional parameters
//   // (i.e., the request IP address)
//   const res = await fetch("/api/auth", {
//     method: "POST",
//     body: JSON.stringify(credentials),
//     headers: { "Content-Type": "application/json" },
//   });

//   console.log("res", res);
//   const user = await res.json();

//   // If no error and we have user data, return it
//   if (res.ok && user) {
//     return user;
//   }
//   // Return null if user data could not be retrieved
//   return null;
// },
