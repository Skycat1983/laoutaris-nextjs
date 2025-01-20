import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import ArtworkInfoCardSkeleton from "@/components/skeletons/ArtworkInfoCardSkeleton";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Suspense } from "react";

const ArtworkViewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense
        fallback={
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
        }
      >
        {children}
      </Suspense>
    </>
  );
};

export default ArtworkViewLayout;

{
  /* <div className="flex flex-row max-w-full  h-[200px] justify-center px-4">
            {artwork && (
              <CroppedImages
                displayedImageIndex={currentImageIndex}
                artworkImgUrlsArr={artworkImgUrlsArr}
                pixelHeight={pixelHeight}
                pixelWidth={pixelWidth}
                updateDisplayedImage={updateDisplayedImage}
              />
            )}
          </div> */
}
