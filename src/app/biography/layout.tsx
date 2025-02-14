"use server";
import React, { Suspense } from "react";
import { BiographySubnavLoader } from "../../components/loaders/componentLoaders/BiographySubnavLoader";
import { SubnavSkeleton } from "@/components/ui/navigation/subnav/Subnav";

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Suspense fallback={<SubnavSkeleton />}>
        <BiographySubnavLoader />
      </Suspense>
      {children}
    </section>
  );
}
