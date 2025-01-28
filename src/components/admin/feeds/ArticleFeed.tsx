import { getArticleFeed } from "@/lib/server/admin/use_cases/getArticleFeed";
import { RefreshButton } from "./RefreshButton";
import { BlogFeedCard } from "./BlogFeedCard";
import { FrontendArticleWithArtwork } from "@/lib/types/articleTypes";
import { ArticleFeedCard } from "../ArticleFeedCard";

export async function ArticleFeed() {
  const articleFeed: FrontendArticleWithArtwork[] = await getArticleFeed();

  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <div className="flex flex-row items-center pt-8 border-b-2">
        <h1 className="text-4xl font-archivo font-semibold p-8">Feed</h1>
        <RefreshButton />
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4 gap-8">
          {articleFeed.map((article, i) => (
            <ArticleFeedCard article={article} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
