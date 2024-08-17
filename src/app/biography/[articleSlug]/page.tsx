import dbConnect from "@/utils/mongodb";
import { fetchBiography } from "@/lib/server/biography/data-fetching/fetchBiography";
import ArticleView from "@/views/ArticleView";

export default async function Article({
  params,
}: {
  params: { articleSlug: string };
}) {
  await dbConnect();
  const result = await fetchBiography(params.articleSlug);
  const article = result.success ? result.data : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4">
      {article && <ArticleView article={article} />}
    </main>
  );
}
