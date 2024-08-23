"use server";

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

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="max-w-full m-4 lg:max-w-[300px]">
          {artwork && (
            <Image
              src={artwork.image.secure_url}
              width={artwork.image.pixelWidth}
              height={artwork.image.pixelHeight}
              alt="Artwork"
              className="contain"
            />
          )}
        </div>
        <div className="max-w-full m-4">
          {artwork && <ArtInfoTabs {...artwork} />}
        </div>
      </div>
    </>
  );
}
