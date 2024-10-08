"use server";

import ArtworkLayout from "@/components/layouts/ArtworkLayout";
import { fetchArtwork } from "@/lib/server/artwork/data-fetching/fetchArtwork";
import dbConnect from "@/utils/mongodb";
import { delay } from "@/utils/debug";

export default async function WatchlistedArtwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  const artworkResult = await fetchArtwork(params.artworkId);
  const artwork = artworkResult.success ? artworkResult.data : null;

  //TODO: cache a version of the dimensions for the artwork so that loading.tsx can create a skeleton with the correct dimensions

  // return <>{artwork && <ArtworkView {...artwork} />}</>;
  return <>{artwork && <ArtworkLayout {...artwork} />}</>;
}
