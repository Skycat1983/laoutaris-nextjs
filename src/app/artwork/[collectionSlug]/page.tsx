import dbConnect from "@/utils/mongodb";
import { getCollection } from "@/lib/server/collection/getCollection";
import CollectionView from "@/views/CollectionView";
import { headers } from "next/headers";
import { fetchUserWatchlist } from "@/lib/server/user/data-fetching/fetchUserWatchlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Collection({
  params,
}: {
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const collection = await getCollection(params.collectionSlug);

  let watchlist: string[] = [];

  if (session?.user?.name) {
    const watchlistResponse = await fetchUserWatchlist(session.user.name);
    if (watchlistResponse.success) {
      watchlist = watchlistResponse.data;
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
      {collection && (
        <CollectionView collection={collection} watchlist={watchlist} />
      )}
    </main>
  );
}
