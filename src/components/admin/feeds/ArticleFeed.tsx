import { ArticleFeedCard } from "../ArticleFeedCard";
import { fetchArticleFeed } from "@/lib/api/feedApi";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";
import { Suspense } from "react";
import { Feed } from "@/components/generic/Feed";

export function ArticleFeed() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <Feed
        fetchFn={fetchArticleFeed}
        CardComponent={ArticleFeedCard}
        title="Article Feed"
      />
    </Suspense>
  );
}

// export async function ArticleFeed() {
//   await delay(2000);
//   const { data }: PaginatedResponse<FrontendArticleWithArtwork[]> =
//     await fetchArticleFeed();
//   // console.log("data in ArticleFeed", data);

//   return (
//     <div className="w-full h-full hover:bg-whitish border-l-2">
//       <div className="flex flex-row items-center pt-8 border-b-2">
//         <h1 className="text-4xl font-archivo font-semibold p-8">Feed</h1>
//         <RefreshButton />
//       </div>

//       <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
//         <div className="flex flex-col gap-5 items-center p-4 gap-8">
//           {data.map((article) => (
//             <ArticleFeedCard key={article._id} article={article} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
