"use server";

import ArtworkView from "@/components/layouts/ArtworkView";
import { authOptions } from "@/lib/config/authOptions";
import { SanitizedArtwork } from "@/lib/resolvers/artworkToView";
import { getArtworkView } from "@/lib/use_cases/getArtworkView";
import { delay } from "@/utils/debug";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";

export default async function ArtworkId({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  await delay(2000);
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const artworkId = params.artworkId;
  const artworkData: SanitizedArtwork = await getArtworkView({
    artworkId,
    currentUserId: userId,
  });

  return (
    <>
      <ArtworkView {...artworkData} />
    </>
  );
}
