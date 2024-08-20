import dbConnect from "@/utils/mongodb";
import { fetchBiography } from "@/lib/server/biography/data-fetching/fetchBiography";
import ArticleView from "@/views/ArticleView";
import MobileArticleView from "@/views/MobileArticleView";

export default async function Article({
  params,
}: {
  params: { articleSlug: string };
}) {
  await dbConnect();
  const result = await fetchBiography(params.articleSlug);
  const article = result.success ? result.data : null;

  return (
    <main className="flex flex-col items-center justify-between lg:px-12 py-4">
      {article && <MobileArticleView article={article} />}
      {/* {article && <ArticleView article={article} />} */}
    </main>
  );
}
