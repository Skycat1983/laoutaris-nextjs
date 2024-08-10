import dbConnect from "@/utils/mongodb";
import { getArticle } from "@/utils/server/getArticle";
import { getSectionItem } from "@/utils/server/getSectionItem";
import Article from "@/views/Article";

export default async function Item({ params }: { params: { slug: string } }) {
  await dbConnect();
  const sectionItem = await getArticle(params.slug);
  console.log("sectionItem :>> ", sectionItem);

  return (
    <main className="flex min-h-screen flex-col items-start justify-between px-24 py-4">
      {sectionItem && <Article article={sectionItem} />}
    </main>
  );
}
