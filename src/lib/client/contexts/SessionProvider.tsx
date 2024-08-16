"use client";

// import { SessionProvider } from "next-auth/react";
// export default SessionProvider;

import { SessionProvider, useSession } from "next-auth/react";

interface SessionProviderProps {
  session: any;
  children: React.ReactNode;
}

export const SessionContextProvider = ({
  children,
  session,
}: SessionProviderProps) => {
  console.log("session passed to SessionContextProvider", session);

  // const { data, status } = useSession();

  // console.log("data retrived by ", data);

  return <SessionProvider session={session}>{children}</SessionProvider>;
};
export default SessionProvider;
