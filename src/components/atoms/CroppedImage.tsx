import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import Image from "next/image";
import React from "react";

type Props = {
  artwork: IFrontendArtwork;
};

const CroppedImage = ({ artwork }: Props) => {
  console.log("artwork in cropped image:>> ", artwork);
  const { image } = artwork;
  const { secure_url, pixelHeight, pixelWidth } = image;

  // Calculate the new width and height for cropping (e.g., zoom into 50% of the original)
  const zoomFactor = 0.5; // Zoom into 50% of the original image
  const croppedWidth = Math.floor(pixelWidth * zoomFactor);
  const croppedHeight = Math.floor(pixelHeight * zoomFactor);

  // Construct the cropped and scaled URL
  const croppedUrl = `${secure_url.replace(
    "/upload/",
    `/upload/c_crop,g_north,w_${croppedWidth},h_${croppedHeight}/c_scale,w_${pixelWidth},h_${pixelHeight}/`
  )}`;

  console.log("croppedUrl :>> ", croppedUrl);

  return (
    <span className="m-4 max-h-[70vh] justify-center lg:justify-self-end flex justify-end ">
      <Image
        src={croppedUrl}
        width={pixelWidth}
        height={pixelHeight}
        alt={artwork.title || "Artwork"}
        className="object-contain max-h-full w-auto shadow-2xl"
      />
    </span>
  );
};

export default CroppedImage;
