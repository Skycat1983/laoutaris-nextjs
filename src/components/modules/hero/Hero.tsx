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
import { FilterableArtworks, FilterableArtworks2 } from "./FilterableArtworks";
import { LargeScaleWorks } from "./LargeScaleWorks";
import { Skeleton } from "@/components/shadcn/skeleton";
import {
  BottomPanelSlide,
  CenterFocusSlide,
  GridLayoutSlide,
  LeftPanelSlide,
  MinimalSlide,
  RightPanelSlide,
  SplitLayoutSlide,
} from "./HeroSlides";
import {
  LeftPortraitOverlapSlide,
  LeftPortraitVerticalSlide,
  RightPortraitCardSlide,
  RightPortraitSlide,
} from "./PortraitHeroSlides";
import {
  LeftPortraitCenteredSlide,
  LeftPortraitVerticalRhythmSlide,
  RightPortraitCleanSlide,
  RightPortraitLargeTypeSlide,
} from "./PortraitCycleSlides";
import { PortraitsOfBeryl } from "./PortraitsOfBeryl";

const slideDataStudio4 = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e20004" },
  title: "Works in Progress",
  subtitle: "Capturing the Process",
  summary:
    "Half-finished paintings and experimental sketches reveal the raw energy of creation before refinement.",
  text: "This stage of the process is where ideas emerge, evolve, and sometimes completely transform.",
  imageUrl:
    // "https://res.cloudinary.com/dzncmfirr/image/upload/e_grayscale/v1706776926/studio-thumbnails/JRL_studio1_012_smdlzw.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/e_grayscale/v1706776930/studio-thumbnails/JRL_studio1_014_fbzagu.jpg",
  section: "artist-studio",
  slug: "works-in-progress",
  artworks: [{ $oid: "65a4f7c9e4b0a3d1f0e30004" }],
  readOnly: false,
  createdAt: { $date: "2025-03-08T16:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T16:30:00.000Z" },
  __v: 0,
};

const slideDataVariationPerson = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1000,w_1500,g_north/v1707470649/art-thumbnails/JRL_w111_crop_so0ecb.jpg",
  // "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1000,w_1500,g_north/v1706775787/art-thumbnails/JRL_w091_crop_lkqyom.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

const slideDataVariationStreet = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    // "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1000,w_1500,g_north/v1707470649/art-thumbnails/JRL_w111_crop_so0ecb.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1706775817/art-thumbnails/JRL_w077_crop_wpecxt.jpg",
  // "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1000,w_1500,g_north/v1707470732/art-thumbnails/JRL_w105_crop_ceoty5.jpg",

  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

const slideDataVariationLandscape = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1707470730/art-thumbnails/JRL_w103_crop_bsstxr.jpg",

  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

const slideDataVariation = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    // "https://res.cloudinary.com/dzncmfirr/image/upload/v1741018193/artwork/hc9zoxn6xfesnr6lgz9i.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1707470755/art-thumbnails/JRL_w152_crop_d1ny6d.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

const slideDataColoursOrange = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    // "https://res.cloudinary.com/dzncmfirr/image/upload/v1741018193/artwork/hc9zoxn6xfesnr6lgz9i.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741018096/artwork/z0e49vzsyidp9ghjntzz.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

const slideDataColoursYellow = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741018193/artwork/hc9zoxn6xfesnr6lgz9i.jpg",
  // "https://res.cloudinary.com/dzncmfirr/image/upload/v1741018096/artwork/z0e49vzsyidp9ghjntzz.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

const slideDataAbstract = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1739636066/artwork/lxkuzke740r4flfk8rky.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

const slideDataFigurative = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Figurative Beginnings",
  subtitle: "Before Abstraction: The Early Works",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741018320/artwork/mditda3z0tdcxps931sr.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};
// "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_2800,w_2500,g_north/v1713361367/artwork/oipyhryrov7znzgddacj.jpg",

const cycleSlideData = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrls: [
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_2000,w_1400,g_west/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg",

    "https://res.cloudinary.com/dzncmfirr/image/upload/v1713360414/artwork/fvcsx991quwdwnqdb2va.jpg",
    // "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1800,w_2500,g_north/v1713359426/artwork/uesiqasxcnmdr1y6ivoh.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1800,w_2500,g_north/v1713360313/artwork/e27oevvokbriq3dio1al.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_2200,w_2500,g_north/v1713361256/artwork/tdg3bdta3qafjwvavqie.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741015706/artwork/vwpf7v39bhaubdybflhv.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741018096/artwork/z0e49vzsyidp9ghjntzz.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1739634385/artwork/mpwv4hqn3uvcg7dzoeoh.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1739636018/artwork/fhpom3tuznldva321tqx.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741015604/artwork/bnd2xppbo7msrnqogys3.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1700,w_2000,g_north/v1741015741/artwork/lizm22vjcbmoniy3q0s0.jpg",
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741015957/artwork/zxcdmszbtezuijipns8o.jpg",
  ],
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

const slideDataVariationPortrait3 = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1741015604/artwork/bnd2xppbo7msrnqogys3.jpg",
  // "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1700,w_2000,g_north/v1741015741/artwork/lizm22vjcbmoniy3q0s0.jpg",
  // "https://res.cloudinary.com/dzncmfirr/image/upload/v1741015957/artwork/zxcdmszbtezuijipns8o.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

// ! KEEP
const slideDataVariationPortrait2 = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1000,w_1500,g_north/v1706775787/art-thumbnails/JRL_w091_crop_lkqyom.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

// ! KEEP
const slideDataVariationPortrait = {
  _id: { $oid: "65a4f7c9e4b0a3d1f0e12345" },
  title: "Exploring Abstract Art",
  subtitle: "A Journey Through Colors and Shapes",
  summary:
    "This slide discusses the evolution and impact of abstract art in modern culture.",
  text: "Abstract art has transformed the way we perceive creativity. From Kandinsky to Pollock, artists have pushed the boundaries of form and meaning.",
  imageUrl:
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1300,w_1500,g_north/v1707470649/art-thumbnails/JRL_w111_crop_so0ecb.jpg",

  // "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1000,w_1500,g_north/v1707470649/art-thumbnails/JRL_w111_crop_so0ecb.jpg",
  // "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,h_1000,w_1500,g_north/v1706775787/art-thumbnails/JRL_w091_crop_lkqyom.jpg",
  section: "art-history",
  slug: "exploring-abstract-art",
  artworks: [
    { $oid: "65a4f7c9e4b0a3d1f0e67890" },
    { $oid: "65a4f7c9e4b0a3d1f0e09876" },
  ],
  readOnly: false,
  createdAt: { $date: "2025-03-08T12:00:00.000Z" },
  updatedAt: { $date: "2025-03-08T12:30:00.000Z" },
  __v: 0,
};

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
        {/* filterable artworks */}
        <CarouselItem className="w-full">
          <FilterableArtworks />
        </CarouselItem>
        <CarouselItem className="w-full">
          <LeftPortraitVerticalSlide data={slideDataVariationPortrait2} />
        </CarouselItem>

        {/* street */}
        <CarouselItem className="w-full">
          <LeftPanelSlide data={slideDataVariationStreet} />
        </CarouselItem>

        <CarouselItem className="w-full">
          <FilterableArtworks2 />
        </CarouselItem>
        {/* landscape */}
        <CarouselItem className="w-full">
          <RightPanelSlide data={slideDataVariationLandscape} />
        </CarouselItem>

        {/* <CarouselItem className="w-full">
          <LeftPortraitCenteredSlide data={cycleSlideData} />
        </CarouselItem> */}

        {/* Red */}
        {/* <CarouselItem className="w-full">
          <LeftPortraitVerticalSlide data={slideDataVariationPortrait3} />
        </CarouselItem> */}

        {/* orange */}
        {/* <CarouselItem className="w-full">
          <BottomPanelSlide data={slideDataColoursOrange} />
        </CarouselItem> */}

        {/* yellow */}
        {/* <CarouselItem className="w-full">
          <LeftPanelSlide data={slideDataColoursYellow} />
        </CarouselItem> */}

        {/* studio */}
        <CarouselItem className="w-full">
          <GridLayoutSlide data={slideDataStudio4} />
        </CarouselItem>

        <CarouselItem className="w-full">
          <PortraitsOfBeryl />
        </CarouselItem>

        <CarouselItem className="w-full">
          <LeftPortraitVerticalSlide data={slideDataVariationPortrait} />
        </CarouselItem>

        <CarouselItem className="w-full ">
          <LargeScaleWorks />
        </CarouselItem>

        {/* Boat */}
        {/* <CarouselItem className="w-full">
          <SplitLayoutSlide data={slideDataFigurative} />
        </CarouselItem> */}

        {/* <CarouselItem className="w-full">
          <LeftPortraitOverlapSlide data={slideDataStudio4} />
        </CarouselItem>
        <CarouselItem className="w-full">
          <RightPortraitSlide data={slideDataStudio4} />
        </CarouselItem> */}

        {/* <CarouselItem className="w-full">
          <LeftPanelSlide data={slideDataVariation} />
        </CarouselItem> */}
        {/* <CarouselItem className="w-full">
          <SplitLayoutSlide data={slideDataAbstract} />
        </CarouselItem> */}
        {/* family faves old */}
        {/* <CarouselItem className="w-full">
          <FamilyFavourites />
        </CarouselItem> */}
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
