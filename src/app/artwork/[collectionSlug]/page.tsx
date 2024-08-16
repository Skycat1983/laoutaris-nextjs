import dbConnect from "@/utils/mongodb";
import { getCollection } from "@/lib/server/artwork/getCollection";
import Collection from "@/views/Collection";
import { headers } from "next/headers";

export default async function Item({
  params,
}: {
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const sectionItem = await getCollection(params.collectionSlug);
  // ! why should i do this here instead of just calling the function directly?
  const { watchlist } = await fetch(
    "http://localhost:3000/api/user/watchlist",
    {
      cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  ).then((res) => {
    return res.json();
  });

  console.log("watchlist :>> ", watchlist);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
      {sectionItem && (
        <Collection collection={sectionItem} watchlist={watchlist} />
      )}
    </main>
  );
}
