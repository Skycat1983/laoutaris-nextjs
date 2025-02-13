"use server";
import React, { Suspense } from "react";
import { BiographySubnavLoader } from "../../components/loaders/BiographySubnavLoader";
import { SubNavSkeleton } from "@/components/ui/subnav/Subnav";

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Suspense fallback={<SubNavSkeleton />}>
        <BiographySubnavLoader />
      </Suspense>
      {children}
    </section>
  );
}
