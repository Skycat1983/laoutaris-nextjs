import { getArticleFeed } from "@/lib/server/admin/use_cases/getArticleFeed";
import { ArticleFeedCard } from "../ArticleFeedCard";
import { delay } from "@/utils/debug";
import { FrontendArticleWithArtwork } from "@/lib/types/articleTypes";
import { RefreshButton } from "./RefreshButton";
import { fetchArticleFeed } from "@/lib/server/admin/data-fetching/fetchArticleFeed";

export async function ArticleFeed() {
  await delay(2000);
  const { data } = await fetchArticleFeed();
  console.log("data", data);
  // const articles = data.articles;
  // console.log("articles", articles);

  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <div className="flex flex-row items-center pt-8 border-b-2">
        <h1 className="text-4xl font-archivo font-semibold p-8">Feed</h1>
        <RefreshButton />
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4 gap-8">
          {data.map((article) => (
            <ArticleFeedCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
