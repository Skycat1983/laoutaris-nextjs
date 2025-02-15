import { Feed } from "@/components/compositions/Feed";
import { CollectionFeedCard } from "@/components/modules/cards/CollectionFeedCard";
import { fetchCollectionFeed } from "@/lib/api/admin/feedApi";

export function CollectionFeed({ page = 1 }: { page?: number }) {
  return (
    <Feed
      fetchFn={(params) => fetchCollectionFeed({ ...params, page })}
      CardComponent={CollectionFeedCard}
      title="Collection Feed"
    />
  );
}
