import {
  BlogFeedCard,
  BlogFeedCardSkeleton,
} from "../../modules/cards/BlogFeedCard";
import { fetchBlogFeed } from "@/lib/api/admin/feedApi";
import { Feed, FeedSkeleton } from "@/components/compositions/Feed";
import { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { SkeletonFactory } from "@/components/compositions/SkeletonFactory";
import { Suspense } from "react";

function BlogFeedSkeleton() {
  return (
    <SkeletonFactory
      Layout={FeedSkeleton}
      Card={BlogFeedCardSkeleton}
      count={3}
    />
  );
}

export function BlogFeed({ page = 1 }: { page?: number }) {
  return (
    // <Suspense fallback={<BlogFeedSkeleton />}>
    <Feed<FrontendBlogEntry>
      fetchFn={(params) => fetchBlogFeed({ ...params, page })}
      CardComponent={BlogFeedCard}
      title="Blog Feed"
    />
    // </Suspense>
  );
}
