import { ArticleFeedCard } from "../../modules/cards/ArticleFeedCard";
import { fetchArticleFeed } from "@/lib/api/admin/feedApi";
import { FeedSkeleton } from "@/components/elements/skeletons/FeedSkeleton";
import { Suspense } from "react";
import { Feed } from "@/components/compositions/Feed";

export function ArticleFeed() {
  return (
    <Feed
      fetchFn={fetchArticleFeed}
      CardComponent={ArticleFeedCard}
      title="Article Feed"
    />
  );
}
