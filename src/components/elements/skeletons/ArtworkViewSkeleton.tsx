import React from "react";
import { Skeleton } from "../../shadcn/skeleton";
import ArtworkInfoCardSkeleton from "./ArtworkInfoCardSkeleton";
import HorizontalDivider from "../misc/HorizontalDivider";

const ArtworkViewSkeleton = () => {
  return (
    <>
      <div
        className="
  grid 
  grid-rows-[minmax(0,max-content),minmax(0,1fr)] 
  gap-10
  lg:grid-cols-[1fr,1fr]
  lg:gap-4
"
      >
        <span className="m-4 max-h-[70vh] justify-center lg:justify-self-end flex justify-end ">
          <Skeleton className="max-h-full, w-[500px] rounded-xl" />
        </span>

        <div className=" h-auto max-h-[70vh] flex flex-row justify-center items-center">
          <ArtworkInfoCardSkeleton />
        </div>
      </div>
      <div className="p-6">
        <HorizontalDivider />
      </div>
    </>
  );
};

export default ArtworkViewSkeleton;
