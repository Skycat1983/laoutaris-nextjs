import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/hero/carousel";
import { DimmedOverlay, RadialGradientOverlay } from "./Overlays";
import Slide, { IHeroSlide } from "./Slide";

const Hero = () => {
  const heroSlides: IHeroSlide[] = [
    {
      image: {
        url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713359817/artwork/lapbp1anawjzvayajq3s.jpg",
        heading: {
          text: "Browse the archive of large-scale works",
          className:
            "col-start-2 col-end-10 row-start-4 row-end-4 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-5 lg:row-start-4 lg:row-end-5 text-left z-10 text-5xl font-archivoBlack text-white",
        },
        subheading: null,
        summary: null,
        link: {
          path: "/artwork",
          text: "Browse",
          className:
            "col-start-2 col-end-10 row-start-5 row-end-8 lg:col-start-2 lg:col-end-5 lg:row-start-5 lg:row-end-6 flex flex-row items-center justify-center border border-black bg-black text-center text-lg font-bold font-archivo text-white w-1/2 h-[50px] w-[240px] py-[10px]",
        },
      },
      backgroundAdjustments: {
        position: "0% 34%",
        size: "120%",
      },
      overlay: <RadialGradientOverlay />,
    },
    {
      image: {
        url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361125/artwork/s6ut8kg4oxst7g4yefiv.jpg",
        heading: {
          text: "Family Favourites",
          className:
            "col-start-2 col-end-10 row-start-5 row-end-5 lg:col-start-9 lg:col-end-12 lg:row-start-5 lg:row-end-5 text-left overlay-text font-cormorant text-5xl pl-10 border-l-[6px] border-white",
        },
        subheading: {
          text: "A curated collection",
          className:
            "col-start-2 col-end-10 row-start-6 row-end-6 lg:col-start-9 lg:col-end-12 lg:row-start-6 lg:row-end-6 text-left overlay-text font-archivo font-bold text-2xl pl-10 border-l-[6px] border-white h-min",
        },
        summary: {
          text: "A beloved piece chosen by each of his grandchildren",
          className:
            "col-start-2 col-end-10 row-start-7 row-end-7  lg:col-start-9 lg:col-end-12 lg:row-start-7 lg:row-end-7 text-left overlay-text font-archivo text-xl ml-10",
        },
        link: {
          path: "/artwork",
          text: "Browse",
          className:
            "col-start-2 col-end-10 row-start-8 row-end-8 lg:col-start-9 lg:col-end-12 lg:row-start-8 lg:row-end-8 flex flex-row items-center justify-center border border-black bg-black text-center text-lg font-bold font-archivo text-white w-2/3 h-[50px] w-[240px] ml-10",
        },
      },
      backgroundAdjustments: {
        position: "center 43%",
        size: "100%",
      },
      overlay: <DimmedOverlay />,
    },
  ];

  //   return (
  //     <Carousel className="w-full bg-red-100 flex flex-col justify-center items-center">
  //       <CarouselContent className="w-full">
  //         {heroSlides.map((slide, index) => (
  //           <CarouselItem className="" key={index}>
  //             <Slide slide={slide} />
  //           </CarouselItem>
  //         ))}
  //       </CarouselContent>
  //       <div className="flex flex-row">
  //         <div className="l-0 bg-green-100">
  //           <h1>L</h1>
  //           <CarouselPrevious />
  //           <CarouselPrevious />

  //           <CarouselPrevious />

  //           <CarouselPrevious />
  //         </div>
  //         <div className="r-0 bg-green-100">
  //           <h1>R</h1>

  //           <CarouselNext />
  //         </div>
  //       </div>
  //     </Carousel>
  //   );
  // };

  return (
    <Carousel className="w-full bg-red-100 flex flex-row justify-between">
      <div className="l-0 bg-green-100">
        <h1>caroussel prev</h1>
        <CarouselPrevious />
      </div>
      <CarouselContent className="w-full">
        {heroSlides.map((slide, index) => (
          <CarouselItem className="" key={index}>
            <Slide slide={slide} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="r-0 bg-green-100">
        <h1>caroussel next</h1>

        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default Hero;
