"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/modules/hero/carousel";
import {
  FilterableArtworks,
  FilterableArtworks2,
} from "./slides/FilterableArtworks";
import { LargeScaleWorks } from "./slides/LargeScaleWorks";
import { Skeleton } from "@/components/shadcn/skeleton";

import { FamilyFavourites } from "./slides/FamilyFavourites";
import { COMING_SOON_SLIDE, FAMILY_FAVOURITES_SLIDE } from "@/lib/constants";
import { ComingSoonSlide } from "./slides/ComingSoon";

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
          <ComingSoonSlide data={COMING_SOON_SLIDE} />
        </CarouselItem>
        <CarouselItem className="w-full ">
          <LargeScaleWorks />
        </CarouselItem>
        <CarouselItem className="w-full">
          <FamilyFavourites data={FAMILY_FAVOURITES_SLIDE} />
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

{
  /* !PROG POINT */
}
{
  /* <CarouselItem className="w-full">
          <LeftPortraitVerticalSlide data={slideDataVariationPortrait2} />
        </CarouselItem> */
}
{
  /* orange figure */
}

{
  /* <CarouselItem className="w-full">
          <FilterableArtworks2 />
        </CarouselItem> */
}
{
  /* landscape */
}
{
  /* studio 2 */
}

{
  /* studio */
}
{
  /* <CarouselItem className="w-full">
          <GridLayoutSlide data={slideDataStudio4} />
        </CarouselItem> */
}
{
  /* <CarouselItem className="w-full">
          <MinimalSlide data={slideDataColoursOrange} />
        </CarouselItem> */
}
{
  /* <CarouselItem className="w-full">
          <PortraitsOfBeryl />
        </CarouselItem> */
}
{
  /* large scale works */
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
