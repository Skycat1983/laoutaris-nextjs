import dbConnect from "@/utils/mongodb";
import { getCollection } from "@/utils/server/getCollection";
import Collection from "@/views/Collection";

export default async function Item({ params }: { params: { slug: string } }) {
  await dbConnect();
  const sectionItem = await getCollection(params.slug);
  console.log("sectionItem :>> ", sectionItem);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-4">
      {sectionItem && <Collection collection={sectionItem} />}
    </main>
  );
}
