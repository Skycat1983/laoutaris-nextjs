import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/hero/carousel";
import LargeScaleWorks from "./LargeScaleWorks";
import FamilyFavourites from "./FamilyFavourites";

const Hero = () => {
  return (
    <Carousel
      className="w-full h-auto p-4 bg-red-800/10 flex flex-col gap-0 justify-center items-center pt-[145px]"
      opts={{
        align: "end",
        loop: true,
      }}
    >
      <CarouselContent className="">
        <CarouselItem className="">
          <LargeScaleWorks />
        </CarouselItem>

        <CarouselItem className="">
          <FamilyFavourites />
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
};
export default Hero;

{
  /* <div className="bg-blue-100 h-[100px] absolute flex flex-row top-[290px]">
        <div className="l-0 bg-green-800/10">
          <CarouselPrevious />
        </div>
        <div className="r-0 bg-green-800/10">
          <CarouselNext />
        </div>
      </div> */
}

// const heroSlides: IHeroSlide[] = [
//   {
//     width: 3504,
//     height: 2927,
//     image: {
//       url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713359817/artwork/lapbp1anawjzvayajq3s.jpg",
//       heading: {
//         text: "Browse the archive of large-scale works",
//         className:
//           "col-start-2 col-end-10 row-start-4 row-end-4 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-5 lg:row-start-4 lg:row-end-5 text-left z-10 text-5xl font-archivoBlack text-white",
//       },

//       subheading: null,
//       summary: null,
//       link: {
//         path: "/artwork",
//         text: "Browse",
//         className:
//           "col-start-2 col-end-10 row-start-5 row-end-8 lg:col-start-2 lg:col-end-5 lg:row-start-5 lg:row-end-6 flex flex-row items-center justify-center border border-black bg-black text-center text-lg font-bold font-archivo text-white w-1/2 h-[50px] w-[240px] py-[10px]",
//       },
//     },
//     backgroundAdjustments: {
//       position: "0% 34%",
//       size: "120%",
//     },
//     overlay: <RadialGradientOverlay />,
//   },
//   {
//     height: 3504,
//     width: 2723,
//     image: {
//       url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361125/artwork/s6ut8kg4oxst7g4yefiv.jpg",
//       heading: {
//         text: "Family Favourites",
//         className:
//           "text-white col-start-2 col-end-10 row-start-5 row-end-5 lg:col-start-9 lg:col-end-12 lg:row-start-5 lg:row-end-5 text-left overlay-text font-cormorant text-5xl pl-10 border-l-[6px] border-white",
//       },
//       subheading: {
//         text: "A curated collection",
//         className:
//           "text-white col-start-2 col-end-10 row-start-6 row-end-6 lg:col-start-9 lg:col-end-12 lg:row-start-6 lg:row-end-6 text-left overlay-text font-archivo font-bold text-2xl pl-10 border-l-[6px] border-white h-min",
//       },
//       summary: {
//         text: "A beloved piece chosen by each of his grandchildren",
//         className:
//           "text-white col-start-2 col-end-10 row-start-7 row-end-7  lg:col-start-9 lg:col-end-12 lg:row-start-7 lg:row-end-7 text-left overlay-text font-archivo text-xl ml-10",
//       },
//       link: {
//         path: "/artwork",
//         text: "Browse",
//         className:
//           "text-white col-start-2 col-end-10 row-start-8 row-end-8 lg:col-start-9 lg:col-end-12 lg:row-start-8 lg:row-end-8 flex flex-row items-center justify-center border border-black bg-black text-center text-lg font-bold font-archivo text-white w-2/3 h-[50px] w-[240px] ml-10",
//       },
//     },
//     backgroundAdjustments: {
//       position: "center 43%",
//       size: "100%",
//     },
//     overlay: <DimmedOverlay />,
//   },
// ];
