"use client";

import { SessionProvider } from "next-auth/react";

interface SessionProviderProps {
  session: any;
  children: React.ReactNode;
}

export const SessionContextProvider = ({
  children,
  session,
}: SessionProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
export default SessionProvider;
