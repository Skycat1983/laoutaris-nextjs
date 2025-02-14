import { Feed } from "@/components/compositions/Feed";
import { FeedSkeleton } from "@/components/elements/skeletons/FeedSkeleton";
import { CollectionFeedCard } from "@/components/modules/cards/CollectionFeedCard";
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
