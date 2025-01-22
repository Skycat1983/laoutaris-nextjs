"use server";

import dbConnect from "@/utils/mongodb";
import { SanitizedArtwork } from "@/lib/server/artwork/resolvers/artworkToView";
import ArtworkView from "@/components/views/ArtworkView";
import { getArtworkView } from "@/lib/server/artwork/use_cases/getArtworkView";

//TODO: cache a version of the dimensions for the artwork so that loading.tsx can create a skeleton with the correct dimensions

export default async function WatchlistedArtwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  // await delay(2000);
  const { artworkId } = params;
  const artworkData: SanitizedArtwork = await getArtworkView({
    collectionSlug: "favourites",
    artworkId,
  });

  console.log("params :>> ", params);

  return (
    <>
      <ArtworkView {...artworkData} />
      {/* <ArtInfoTabs {...artworkData} /> */}
    </>
  );
}
