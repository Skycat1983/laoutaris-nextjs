"use server";
import dbConnect from "@/utils/mongodb";
import React, { Suspense } from "react";
import SubNavSkeleton from "@/components/skeletons/SubNavSkeleton";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { getBiographySubNavData } from "@/lib/server/article/use_cases/getArticleSubnavData";

export default async function BiographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  // await delay(2000);
  // const fetchLinks = getBiographySubNavData;

  return (
    <section>
      <Suspense fallback={<SubNavSkeleton />}>
        <SubNavBar fetchLinks={getBiographySubNavData} />
      </Suspense>
      {children}
    </section>
  );
}
