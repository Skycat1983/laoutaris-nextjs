"use server";

import dbConnect from "@/lib/db/mongodb";
import { Suspense } from "react";
import { FavouritedArtworkLoader } from "@/components/loaders/viewLoaders/FavouritedArtworkLoader";
import ArtworkViewSkeleton from "@/components/elements/skeletons/ArtworkViewSkeleton";

export default async function FavouritedArtwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  const { artworkId } = params;

  console.log("artworkId", artworkId);

  return (
    <>
      <Suspense fallback={<ArtworkViewSkeleton />}>
        <FavouritedArtworkLoader artworkId={artworkId} />
      </Suspense>
    </>
  );
}
