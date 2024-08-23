"use server";

import CroppedImage from "@/components/atoms/CroppedImage";
import ZoomWrapper from "@/components/atoms/ZoomWrapper";
import ArtworkInfoCard from "@/components/cards/artworkInfoCard/ArtworkInfoCard";
import ArtInfoTabs from "@/components/ui/artInfoTabs/ArtInfoTabs";
import { fetchArtwork } from "@/lib/server/artwork/data-fetching/fetchArtwork";
import dbConnect from "@/utils/mongodb";
import Image from "next/image";

export default async function Artwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  const artworkResult = await fetchArtwork(params.artworkId);
  const artwork = artworkResult.success ? artworkResult.data : null;

  console.log("artwork [artworkId]", artwork);

  const orientation = artwork?.image
    ? artwork.image.pixelHeight > artwork.image.pixelWidth
      ? "portrait"
      : "landscape"
    : null;

  let className = "";

  if (artwork?.image) {
    const width = artwork.image.pixelWidth;
    const height = artwork.image.pixelHeight;
    // className = `object-scale-down max-w-[${width}px] max-h-[${height}px]`;
    className = `object-scale-down w-[${width}px] h-[${height}px]`;
  }

  return (
    <>
      <div
        className="
          grid 
          grid-rows-[minmax(0,max-content),minmax(0,1fr)] 
          lg:grid-cols-[1fr,1fr]
          gap-4
        "
      >
        <span className="m-4 max-h-[70vh] justify-center lg:justify-self-end flex justify-end ">
          {artwork && (
            <Image
              src={artwork.image.secure_url}
              width={artwork.image.pixelWidth}
              height={artwork.image.pixelHeight}
              alt="Artwork"
              className="object-contain max-h-full w-auto shadow-2xl"
            />
          )}
        </span>

        <div className=" h-auto max-h-[70vh] flex flex-row justify-center items-center">
          {artwork && <ArtworkInfoCard {...artwork} />}
        </div>
      </div>
      {/* {artwork && <CroppedImage artwork={artwork} />} */}
    </>
  );
}

{
  /* <span className="m-4 max-h-[70vh] justify-center lg:justify-self-end flex justify-end ">
            {artwork && (
              <Image
                src={artwork.image.secure_url}
                width={artwork.image.pixelWidth}
                height={artwork.image.pixelHeight}
                alt="Artwork"
                className="object-contain max-h-full w-auto shadow-2xl"
              />
            )}
          </span> */
}

// className="object-contain"
// className="object-scale-down"
// className={className}
// ! working version but just on mobile

{
  /* <div className="flex flex-col lg:flex-row">
        <div className=" m-4 lg:h-[30vh]">
          {artwork && (
            <Image
              src={artwork.image.secure_url}
              width={artwork.image.pixelWidth}
              height={artwork.image.pixelHeight}
              alt="Artwork"
              className="object-contain"
            />
          )}
        </div>
        <div className="max-w-full m-4">
          {artwork && <ArtInfoTabs {...artwork} />}
        </div>
      </div> */
}

// ! possibly fun on large screens

// return (
//   <>
//     <div className="grid w-max md:grid-rows md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 bg-red-100 p-4 h-auto lg:px-16">
//       <div className="w-full md:place-self-center lg:col-span-2 lg:place-self-end p-4  h-[70vh] w-auto bg-green-100 shrink-0 lg:mr-32">
//         {artwork && (
//           <Image
//             src={artwork.image.secure_url}
//             width={artwork.image.pixelWidth}
//             height={artwork.image.pixelHeight}
//             alt="Artwork"
//             className="max-h-full w-auto object-contain"
//           />
//         )}
//       </div>
//       <div className="bg-yellow-100 h-auto max-h-[70vh] flex flex-row md:justify-center lg:justify-end w-full pt-12">
//         {artwork && <ArtworkInfoCard {...artwork} />}
//       </div>
//     </div>
//   </>
// );
