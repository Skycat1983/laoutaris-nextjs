"use server";

import ArtworkView from "@/components/atoms/ArtworkView";
import ArtworkLayout from "@/components/layouts/ArtworkLayout";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { fetchArtworks } from "@/lib/server/artwork/data-fetching/fetchArtworks";
import { delay } from "@/utils/debug";
import dbConnect from "@/utils/mongodb";

//TODO: cache a version of the dimensions for the artwork so that loading.tsx can create a skeleton with the correct dimensions
//? maybe this is better done with the fetchArtwork function
export default async function ArtworkId({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  // await delay(2000);
  const artworkKey = "_id";
  const artworkValue = params.artworkId;
  const response = await fetchArtworks<IFrontendArtwork>(
    artworkKey,
    artworkValue
  );

  if (!response.success) {
    return <div>Failed to fetch artwork</div>;
  }
  const { data: artwork } = response;

  console.log("data", artwork);

  // return <>{artwork && <ArtworkView {...artwork} />}</>;
  return (
    <>
      <ArtworkLayout {...artwork[0]} />
    </>
  );
}
