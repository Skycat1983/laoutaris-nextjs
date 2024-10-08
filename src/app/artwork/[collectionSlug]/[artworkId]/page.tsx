"use server";

import ArtworkView from "@/components/atoms/ArtworkView";
import ArtworkLayout from "@/components/layouts/ArtworkLayout";
import { fetchArtwork } from "@/lib/server/artwork/data-fetching/fetchArtwork";
import { delay } from "@/utils/debug";
import dbConnect from "@/utils/mongodb";

export default async function ArtworkId({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  // await delay(2000);
  const artworkResult = await fetchArtwork(params.artworkId);
  const artwork = artworkResult.success ? artworkResult.data : null;

  //TODO: cache a version of the dimensions for the artwork so that loading.tsx can create a skeleton with the correct dimensions

  // return <>{artwork && <ArtworkView {...artwork} />}</>;
  return <>{artwork && <ArtworkLayout {...artwork} />}</>;
}

// ! IMPORTANT: of artworkView tsx
{
  /* <div
        className="
          grid 
          grid-rows-[minmax(0,max-content),minmax(0,1fr)] 
          gap-10
          lg:grid-cols-[1fr,1fr]
          lg:gap-4
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
      <div className="flex flex-row max-w-full m-4 h-[200px]">
        {artwork && <CroppedImage artwork={artwork} />}
      </div> */
}
