"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ArtworkInfoCard from "@/components/cards/artworkInfoCard/ArtworkInfoCard";
import ArtInfoTabs from "@/components/ui/artInfoTabs/ArtInfoTabs";
import { fetchArtwork } from "@/lib/server/artwork/data-fetching/fetchArtwork";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Artwork({
  params,
}: {
  params: { artworkId: string };
}) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const artworkResult = await fetchArtwork(params.artworkId);

  const artwork = artworkResult.success ? artworkResult.data : null;

  console.log("artwork", artwork);

  return (
    <>
      <div className="max-w-full m-4">
        {artwork && (
          <Image
            src={artwork.image.secure_url}
            width={artwork.image.pixelWidth}
            height={artwork.image.pixelHeight}
            alt="Artwork"
          />
        )}
      </div>
      <div className="max-w-full m-4">
        {/* {artwork && <ArtworkInfoCard watchlisted={false} {...artwork} />}
         */}
        {artwork && <ArtInfoTabs {...artwork} />}
      </div>
    </>
  );
}

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

{
  /* <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4"> */
}
{
  /* {collection && (
          <CollectionView collection={collection} watchlist={watchlist} />
        )} */
}
{
  /* </main> */
}
