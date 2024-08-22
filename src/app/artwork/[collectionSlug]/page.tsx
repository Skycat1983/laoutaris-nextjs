import dbConnect from "@/utils/mongodb";
import { fetchUserWatchlist } from "@/lib/server/user/data-fetching/fetchUserWatchlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchCollection } from "@/lib/server/collection/data-fetching/fetchCollection";
import { fetchCollectionLinks } from "@/lib/server/collection/data-fetching/fetchCollectionLinks";
import { redirect } from "next/navigation";

export default async function Collection({
  params,
}: {
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const stem = "artwork";

  const collectionLinks = await fetchCollectionLinks(stem);
  const { data: availableCollectionLinks } = collectionLinks.success
    ? collectionLinks
    : { data: [] };
  const defaultCollectionSublinkHref = `${availableCollectionLinks[0].slug}/${availableCollectionLinks[0].defaultRedirect}`;

  if (defaultCollectionSublinkHref) {
    redirect(
      `${process.env.NEXTAUTH_URL}/${stem}/${defaultCollectionSublinkHref}`
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
      {/* {collection && (
        <CollectionView collection={collection} watchlist={watchlist} />
      )} */}
    </main>
  );
}

//? unused content below: we now redirect to a default collection/artworkId page
// const collectionResult = await fetchCollection(params.collectionSlug);
// const collection = collectionResult.success ? collectionResult.data : null;

// let watchlist: string[] = [];

// if (session?.user?.name) {
//   const watchlistResponse = await fetchUserWatchlist(session.user.name);
//   if (watchlistResponse.success) {
//     watchlist = watchlistResponse.data;
//   }
// }
