import React from "react";
import HorizontalDivider from "../atoms/HorizontalDivider";
import SectionHeadingSkeleton from "./SectionHeadingSkeleton";
import { Skeleton } from "../ui/shadcn/skeleton";

const HomeArtworkSectionSkeleton = () => {
  const arr = Array.from({ length: 6 }, (_, i) => i);
  return (
    <>
      <SectionHeadingSkeleton />
      <HorizontalDivider />

      <section className="p-4 grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 w-full py-8 gap-5 ">
        {arr.map((artwork, index) => (
          <div key={index} className="relative row-span-1 col-span-1 h-64">
            <Skeleton className="relative w-full h-full" />
          </div>
        ))}
      </section>
      <HorizontalDivider />
    </>
  );
};

export default HomeArtworkSectionSkeleton;
