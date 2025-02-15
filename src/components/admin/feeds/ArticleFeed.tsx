import {
  ArticleFeedCard,
  ArticleFeedCardSkeleton,
} from "../../modules/cards/ArticleFeedCard";
import { fetchArticleFeed } from "@/lib/api/admin/feedApi";
import { FeedSkeleton } from "@/components/elements/skeletons/FeedSkeleton";
import { Feed } from "@/components/compositions/Feed";
import { SkeletonFactory } from "@/components/compositions/SkeletonFactory";

export function ArticleFeed({ page = 1 }: { page?: number }) {
  return (
    <Feed
      fetchFn={(params) => fetchArticleFeed({ ...params, page })}
      CardComponent={ArticleFeedCard}
      title="Article Feed"
    />
  );
}
