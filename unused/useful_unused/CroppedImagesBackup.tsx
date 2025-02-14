import Image from "next/image";
import React from "react";
import { ScrollArea, ScrollBar } from "../../src/components/shadcn/scroll-area";
type CroppedImagesProps = {
  // displayedImageIndex: number;
  artworkImgUrlsArr: string[];
  pixelWidth: number;
  pixelHeight: number;
  // updateDisplayedImage: (index: number) => void;
};

const CroppedImages = ({
  // displayedImageIndex,
  artworkImgUrlsArr,
  pixelHeight,
  pixelWidth,
}: // updateDisplayedImage,
CroppedImagesProps) => {
  return (
    <ScrollArea className="container whitespace-nowrap rounded-md h-[200px] flex w-full">
      <div className="flex flex-row mx-auto h-[200px] w-max mx-auto gap-4 lg:gap-10 ">
        {artworkImgUrlsArr.map((url, index) => (
          <Image
            key={index}
            src={url}
            width={pixelWidth}
            height={pixelHeight}
            alt={"Untitled artwork"}
            className="object-contain max-h-full w-auto shadow-lg"
            // onClick={() => updateDisplayedImage(index)}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="p-12" />
    </ScrollArea>
  );
};

export default CroppedImages;

{
  /* <Image
        src={artwork.image.secure_url}
        width={pixelWidth}
        height={pixelHeight}
        alt={artwork.title || "Artwork"}
        className="object-contain max-h-full w-auto shadow-lg"
        onClick={()=>{}}
      /> */
}
