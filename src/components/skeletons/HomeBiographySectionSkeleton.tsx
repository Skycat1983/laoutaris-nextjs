import React from "react";
import { Skeleton } from "../ui/shadcn/skeleton";
import HorizontalDivider from "../atoms/HorizontalDivider";
import SectionHeadingSkeleton from "./SectionHeadingSkeleton";
import { ScrollArea } from "../ui/shadcn/scroll-area";

const HomeBiographySectionSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SectionHeadingSkeleton />
      <HorizontalDivider />
      <ScrollArea className="container whitespace-nowrap rounded-md h-[500px]">
        <section className="p-4 flex w-max space-x-4 h-[500px] mx-auto">
          <Skeleton className="h-[300px] w-[250px]" />
          <Skeleton className="h-[300px] w-[250px]" />
          <Skeleton className="h-[300px] w-[250px]" />
          <Skeleton className="h-[300px] w-[250px]" />
          <Skeleton className="h-[300px] w-[250px]" />
        </section>
      </ScrollArea>
      <HorizontalDivider />
    </div>
  );
};

export default HomeBiographySectionSkeleton;
