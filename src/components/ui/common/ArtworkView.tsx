// "use client";
// import { useCallback, useState } from "react";

import ArtworkInfoCard from "@/components/ui/cards/artworkInfoCard/ArtworkInfoCard";
import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import { SanitizedArtwork } from "@/lib/server/artwork/resolvers/artworkToView";
import Image from "next/image";

// TODO: refactor the image zooming logic
// ! NOTE: the page will load faster if we fetch one at a time.

const ArtworkView = (artwork: SanitizedArtwork) => {
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
          <ArtworkInfoCard {...artwork} />
        </div>
      </div>
      <div className="p-6">
        <HorizontalDivider />
      </div>

      <div className="flex flex-row max-w-full  h-[200px] justify-center px-4"></div>
    </>
  );
};

export default ArtworkView;
