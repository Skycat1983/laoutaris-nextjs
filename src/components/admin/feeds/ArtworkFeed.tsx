import { ArtworkFeedCard } from "../../modules/cards/ArtworkFeedCard";
import { fetchArtworkFeed } from "@/lib/api/admin/feedApi";
import { Feed } from "@/components/compositions/Feed";

export function ArtworkFeed({ page = 1 }: { page?: number }) {
  return (
    <Feed
      fetchFn={(params) => fetchArtworkFeed({ ...params, page })}
      CardComponent={ArtworkFeedCard}
      title="Artwork Feed"
    />
  );
}
