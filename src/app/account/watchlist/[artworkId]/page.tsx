"use server";

import ArtworkViewSkeleton from "@/components/elements/skeletons/ArtworkViewSkeleton";
import { WatchlistedArtworkLoader } from "@/components/loaders/viewLoaders/WatclistedArtworkLoader";
import { Suspense } from "react";

export default async function WatchlistedArtwork({
  params,
}: {
  params: { artworkId: string };
}) {
  return (
    <>
      <Suspense fallback={<ArtworkViewSkeleton />}>
        <WatchlistedArtworkLoader artworkId={params.artworkId} />
      </Suspense>
    </>
  );
}
