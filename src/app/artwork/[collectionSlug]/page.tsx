import dbConnect from "@/utils/mongodb";
import { getCollection } from "@/utils/server/getCollection";
import Collection from "@/views/Collection";

export default async function Item({
  params,
}: {
  params: { collectionSlug: string };
}) {
  await dbConnect();
  const sectionItem = await getCollection(params.collectionSlug);
  console.log("sectionItem :>> ", sectionItem);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 lg:px-24 py-4">
      {sectionItem && <Collection collection={sectionItem} />}
    </main>
  );
}
