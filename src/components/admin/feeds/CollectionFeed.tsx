import { Feed } from "@/components/generic/Feed";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";
import { fetchCollectionFeed } from "@/lib/api/feedApi";
import { Suspense } from "react";

export function CollectionFeed() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <Feed
        fetchFn={fetchCollectionFeed}
        CardComponent={CollectionFeedCard}
        title="Collection Feed"
      />
    </Suspense>
  );
}
