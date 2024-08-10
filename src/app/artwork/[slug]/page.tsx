import dbConnect from "@/utils/mongodb";
import { getSectionItem } from "@/utils/server/getSectionItem";
import Collection from "@/views/Collection";

export default async function Item({ params }: { params: { slug: string } }) {
  await dbConnect();
  const sectionItem = await getSectionItem(params.slug);
  console.log("sectionItem :>> ", sectionItem);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {sectionItem && <Collection collection={sectionItem} />}
      {/* <Subnav items={subNavLinks} stem={stem} /> */}
      {/* <h1>biogrpahy</h1> */}
      {/* <Article article={sectionItem} /> */}
    </main>
  );
}
