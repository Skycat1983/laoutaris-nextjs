// "use client";

import { Skeleton } from "../shadcn/skeleton";
import { CarouselNext, CarouselPrevious } from "./carousel";

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

// opts={{
//   align: "end",
//   loop: true,
// }}
//   >
{
  /* <CarouselContent className="">
          <CarouselItem className="">
            <LargeScaleWorks />
          </CarouselItem>
  
          <CarouselItem className="">
            <FamilyFavourites />
          </CarouselItem>
        </CarouselContent> */
}
{
  /* <div>
        <div className="absolute pt-[125px]">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div> */
}
