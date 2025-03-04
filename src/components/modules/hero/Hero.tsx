"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/modules/hero/carousel";
import LargeScaleWorks from "./LargeScaleWorks";
import FamilyFavourites from "./FamilyFavourites";
import { FilterableArtworks } from "./FilterableArtworks";

export function Hero() {
  return (
    <Carousel
      className="w-full h-auto p-4 bg-greyish flex flex-col gap-0 justify-center items-center pt-[20px]"
      opts={{
        align: "end",
        loop: true,
      }}
    >
      <CarouselContent className="">
        <CarouselItem className="">
          <FilterableArtworks />
        </CarouselItem>

        <CarouselItem className="">
          <FamilyFavourites />
        </CarouselItem>
        <CarouselItem className="">
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
