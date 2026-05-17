import type { Account, Profile, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserWithRole = User & {
  role?: string;
};

type TokenWithUserState = JWT & {
  id: string;
  role?: string;
};

export const authCallbacks = {
  //! used to determine if a user is allowed to sign in. NOT for reformatting the user object
  async signIn() {
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
  async jwt({
    token,
    user,
  }: {
    token: TokenWithUserState;
    user?: UserWithRole;
    account?: Account | null;
    profile?: Profile;
    isNewUser?: boolean;
  }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }

    return token;
  },

  //? here can customise the session contents
  //! this is not stored. It is only used to create the session object that is returned to the client
  async session({
    session,
    token,
  }: {
    session: Session;
    token: TokenWithUserState;
  }) {
    session.user.id = token.id;
    session.user.role = token.role;
    return session;
  },
};
