"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchArtwork } from "@/lib/server/artwork/data-fetching/fetchArtwork";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";

export default async function Artwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const artworkResult = await fetchArtwork(params.artworkId);

  console.log("artworkResult", artworkResult);

  // // the collection is the main displayed content
  // const collectionResult = await fetchCollection(params.collectionSlug);
  // const collection = collectionResult.success ? collectionResult.data : null;

  // let watchlist: string[] = [];

  // if (session?.user?.name) {
  //   const watchlistResponse = await fetchUserWatchlist(session.user.name);
  //   if (watchlistResponse.success) {
  //     watchlist = watchlistResponse.data;
  //   }
  // }

  return (
    <>
      <div></div>
      {/* <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4"> */}
      {/* {collection && (
          <CollectionView collection={collection} watchlist={watchlist} />
        )} */}
      {/* </main> */}
    </>
  );
}
