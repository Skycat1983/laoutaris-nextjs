import dbConnect from "@/utils/mongodb";
import { getBiography } from "@/utils/server/getBiography";
import Article from "@/views/Article";

export default async function Item({ params }: { params: { slug: string } }) {
  await dbConnect();
  const sectionItem = await getBiography(params.slug);
  console.log("sectionItem :>> ", sectionItem);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4">
      {sectionItem && <Article article={sectionItem} />}
    </main>
  );
}
