import { getArticleFeed } from "@/lib/server/admin/use_cases/getArticleFeed";
import { RefreshButton } from "./RefreshButton";

export async function ArticleFeed() {
  const articleFeed = await getArticleFeed();

  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <div className="flex flex-row items-center pt-8 border-b-2">
        <h1 className="text-4xl font-archivo font-semibold p-8">Feed</h1>
        <RefreshButton />
      </div>
      {articleFeed.map((article) => (
        <div key={article._id}>
          <h2>{article.title}</h2>
          <p>{article.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
