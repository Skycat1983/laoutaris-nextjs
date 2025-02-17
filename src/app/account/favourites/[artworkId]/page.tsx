"use server";

import dbConnect from "@/lib/db/mongodb";
import ArtworkView from "@/components/views/ArtworkView";
import { getArtworkView } from "@/lib/old_code/artwork/use_cases/getArtworkView";
import { Suspense } from "react";
import { UserFavouriteArtworkLoader } from "@/components/loaders/viewLoaders/UserFavouriteArtworkLoader";

//TODO: cache a version of the dimensions for the artwork so that loading.tsx can create a skeleton with the correct dimensions

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
      <Suspense>
        {/* <UserFavouriteArtworkLoader artworkId={artworkId} /> */}
      </Suspense>
    </>
  );
}
