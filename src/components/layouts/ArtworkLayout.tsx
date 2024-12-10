import Image from "next/image";
import React from "react";
import ArtworkInfoCard from "../cards/artworkInfoCard/ArtworkInfoCard";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import HorizontalDivider from "../atoms/HorizontalDivider";
import CroppedImages from "../atoms/CroppedImages";
import ArtworkLoading from "@/app/collections/[collectionSlug]/[artworkId]/loading";
import ArtworkInfoCardSkeleton from "../cards/artworkInfoCard/ArtworkInfoCardSkeleton";

// TODO: refactor the image zooming logic
// ! NOTE: the page will load faster if we fetch one at a time.

const ArtworkLayout = (artwork: IFrontendArtwork) => {
  //   const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const { image } = artwork;
  const { secure_url, pixelHeight, pixelWidth } = image;

  const zoomFactor = 0.5;
  const croppedWidth = Math.floor(pixelWidth * zoomFactor);
  const croppedHeight = Math.floor(pixelHeight * zoomFactor);

  const compassValues = [
    "g_north_west",
    "g_north",
    "g_north_east",
    "g_east",
    "g_center",
    "g_west",
    "g_south_west",
    "g_south",
    "g_south_east",
  ];

  const croppedUrls = compassValues.map((compassValue) =>
    secure_url.replace(
      "/upload/",
      `/upload/c_crop,${compassValue},w_${croppedWidth},h_${croppedHeight}/c_scale,w_${pixelWidth},h_${pixelHeight}/`
    )
  );

  const artworkImgUrlsArr = [secure_url, ...croppedUrls];

  //   const updateDisplayedImage = React.useCallback((index: number) => {
  //     setCurrentImageIndex((prevIndex) => index);
  //   }, []);
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
        {/* ! ADD M4 back to this! */}
        <span className="m-4 max-h-[70vh] justify-center lg:justify-self-end flex justify-end">
          {artwork && (
            <Image
              src={artwork.image.secure_url}
              width={artwork.image.pixelWidth}
              height={artwork.image.pixelHeight}
              alt="Artwork"
              className="object-contain max-h-full w-auto shadow-2xl fade-in"
            />
          )}
        </span>

        <div className=" h-auto max-h-[70vh] flex flex-row justify-center items-center">
          {artwork && <ArtworkInfoCard {...artwork} />}
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

export default ArtworkLayout;
