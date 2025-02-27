"use client";

import React, { useEffect, useState } from "react";
import { GlobalFeaturesProvider } from "@/contexts/GlobalFeaturesContext";
import { SessionProvider } from "next-auth/react";
import PageLoading from "@/components/animations/PageLoading";

interface ClientContextBoundaryProps {
  children: React.ReactNode;
  session: any;
}

export default function ClientContextBoundary({
  children,
  session,
}: ClientContextBoundaryProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PageLoading />
      </div>
    );
  }

  return (
    <SessionProvider session={session}>
      <GlobalFeaturesProvider>{children}</GlobalFeaturesProvider>
    </SessionProvider>
  );
}
