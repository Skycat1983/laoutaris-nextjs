import React from "react";
import { ScrollArea, ScrollBar } from "../ui/shadcn/scroll-area";
import { Skeleton } from "../ui/shadcn/skeleton";

const SubNavSkeleton = () => {
  const skeletonClassName = "z-[99] w-36 h-14";

  return (
    <div className="relative flex flex-row w-full justify-center mx-4">
      <ScrollArea className="whitespace-nowrap rounded-md h-auto">
        <ul className="w-max flex flex-row justify-center space-x-8 my-4 md:my-10">
          <li>
            <Skeleton className={skeletonClassName} />
          </li>
          <li>
            <Skeleton className={skeletonClassName} />
          </li>
          <li>
            <Skeleton className={skeletonClassName} />
          </li>
          <li>
            <Skeleton className={skeletonClassName} />
          </li>
        </ul>
        <ScrollBar orientation="horizontal" className="p-0" />
      </ScrollArea>
    </div>
  );
};

export default SubNavSkeleton;
