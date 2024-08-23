"use server";

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
      {/* Outer container takes the full width of the screen */}
      <div className="grid md:grid-rows md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 bg-red-100 p-4 h-auto px-16">
        <div className="md:place-self-center lg:col-span-2 lg:place-self-end p-4  h-[70vh] w-auto bg-green-100 shrink-0 lg:mr-32">
          {artwork && (
            <Image
              src={artwork.image.secure_url}
              width={artwork.image.pixelWidth}
              height={artwork.image.pixelHeight}
              alt="Artwork"
              className="max-h-full w-auto object-contain"
            />
          )}
        </div>

        {/* Artwork card container */}
        <div className="bg-yellow-100 h-auto max-h-[70vh] flex flex-row md:justify-center lg:justify-end w-full py-12">
          {artwork && <ArtworkInfoCard {...artwork} />}
        </div>
      </div>
    </>
  );
}
{
  /* </div> */
}
{
  /* <div className="lg:hidden max-w-1/4 m-4">
          {artwork && <ArtInfoTabs {...artwork} />}
        </div> */
}
{
  /* <div className="hidden lg:block max-w-1/4 m-4">
        {artwork && <ArtworkInfoCard {...artwork} />}
        </div> */
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
