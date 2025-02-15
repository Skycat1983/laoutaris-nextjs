import { Feed } from "@/components/compositions/Feed";
import { FeedSkeleton } from "@/components/elements/skeletons/FeedSkeleton";
import { CollectionFeedCard } from "@/components/modules/cards/CollectionFeedCard";
import { fetchCollectionFeed } from "@/lib/api/admin/feedApi";
import { Suspense } from "react";

export function CollectionFeed() {
  return (
    <Feed
      fetchFn={fetchCollectionFeed}
      CardComponent={CollectionFeedCard}
      title="Collection Feed"
    />
  );
}
