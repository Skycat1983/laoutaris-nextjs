import { ArticleFeedCard } from "../../ui/cards/ArticleFeedCard";
import { fetchArticleFeed } from "@/lib/api/feedApi";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";
import { Suspense } from "react";
import { Feed } from "@/components/common/Feed";

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
