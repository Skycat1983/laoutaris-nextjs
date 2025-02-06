"use server";
import React, { Suspense } from "react";
import SubNavSkeleton from "@/components/skeletons/SubNavSkeleton";
import { BiographySubnavLoader } from "@/components/loaders/BiographySubnavLoader";

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
