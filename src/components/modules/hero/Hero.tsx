"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/modules/hero/carousel";
import FamilyFavourites from "./FamilyFavourites";
import { FilterableArtworks } from "./FilterableArtworks";
import { LargeScaleWorks } from "./LargeScaleWorks";
import { Skeleton } from "@/components/shadcn/skeleton";

export function Hero() {
  return (
    <Carousel
      className="w-full h-auto p-4 bg-greyish flex flex-col gap-0 justify-center items-center pt-[20px]"
      opts={{
        align: "end",
        loop: true,
      }}
    >
      <CarouselContent className="w-full">
        <CarouselItem className="w-full">
          <FilterableArtworks />
        </CarouselItem>

        <CarouselItem className="w-full">
          <FamilyFavourites />
        </CarouselItem>
        <CarouselItem className="w-full ">
          <LargeScaleWorks />
        </CarouselItem>
      </CarouselContent>
      <div>
        <div className="absolute pt-[125px]">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  );
}

const HeroSkeleton = () => {
  return (
    <div className="w-full h-auto p-4 flex flex-col gap-0 justify-center items-center pt-[20px]">
      <div className="relative h-[600px] max-h-[700px] w-full overflow-hidden ">
        <Skeleton className="relative min-w-[200px] lg:bottom-[100px] xl:bottom-[210px] h-[800px] max-h-[800px]" />
      </div>
    </div>
  );
};
export default HeroSkeleton;
