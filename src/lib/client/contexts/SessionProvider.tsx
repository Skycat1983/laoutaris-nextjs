"use client";

// import { SessionProvider } from "next-auth/react";
// export default SessionProvider;

import { SessionProvider } from "next-auth/react";

interface SessionProviderProps {
  session: any;
  children: React.ReactNode;
}

export const SessionContextProvider = ({
  children,
  session,
}: SessionProviderProps) => {
  console.log("session in SessionContextProvider", session);
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
export default SessionProvider;
