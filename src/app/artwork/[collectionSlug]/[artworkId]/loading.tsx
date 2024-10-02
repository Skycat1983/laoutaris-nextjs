import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import ArtworkInfoCard from "@/components/cards/artworkInfoCard/ArtworkInfoCard";
import ArtworkInfoCardSkeleton from "@/components/cards/artworkInfoCard/ArtworkInfoCardSkeleton";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

const ArtworkLoading = () => {
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
      {/* <div className="flex flex-row max-w-full  h-[200px] justify-center px-4">
            {artwork && (
              <CroppedImages
                displayedImageIndex={currentImageIndex}
                artworkImgUrlsArr={artworkImgUrlsArr}
                pixelHeight={pixelHeight}
                pixelWidth={pixelWidth}
                updateDisplayedImage={updateDisplayedImage}
              />
            )}
          </div> */}
    </>
  );
};

export default ArtworkLoading;
