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
