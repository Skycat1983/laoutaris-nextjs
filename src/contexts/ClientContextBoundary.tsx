"use client";

import React from "react";
import { GlobalFeaturesProvider } from "@/contexts/GlobalFeaturesContext";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface ClientContextBoundaryProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function ClientContextBoundary({
  children,
  session,
}: ClientContextBoundaryProps) {
  return (
    <SessionProvider session={session}>
      <GlobalFeaturesProvider>{children}</GlobalFeaturesProvider>
    </SessionProvider>
  );
}
