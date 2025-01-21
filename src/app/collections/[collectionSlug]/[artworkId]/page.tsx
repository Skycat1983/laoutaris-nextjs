"use server";

import ArtInfoTabs from "@/components/ui/artInfoTabs/ArtInfoTabs";
import ArtworkView from "@/components/views/ArtworkView";
import { SanitizedArtwork } from "@/lib/server/artwork/resolvers/artworkToView";
import { getArtworkView } from "@/lib/server/artwork/use_cases/getArtworkView";
import { delay } from "@/utils/debug";
import dbConnect from "@/utils/mongodb";

export default async function ArtworkId({
  params,
}: {
  params: { collectionSlug: string; artworkId: string };
}) {
  await dbConnect();
  await delay(2000);
  const { collectionSlug, artworkId } = params;

  const artworkData: SanitizedArtwork = await getArtworkView({
    collectionSlug,
    artworkId,
  });

  return (
    <>
      <ArtworkView {...artworkData} />
      {/* <ArtInfoTabs {...artworkData} /> */}
    </>
  );
}
