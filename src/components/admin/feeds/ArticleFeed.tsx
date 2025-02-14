import { ArticleFeedCard } from "../../modules/cards/ArticleFeedCard";
import { fetchArticleFeed } from "@/lib/api/feedApi";
import { FeedSkeleton } from "@/components/elements/skeletons/FeedSkeleton";
import { Suspense } from "react";
import { Feed } from "@/components/compositions/Feed";

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
