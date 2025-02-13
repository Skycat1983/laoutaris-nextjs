import { ArtworkFeedCard } from "../../ui/cards/ArtworkFeedCard";
import { fetchArtworkFeed } from "@/lib/api/feedApi";
import { Feed } from "@/components/generic/Feed";

export function ArtworkFeed() {
  return (
    <Feed
      fetchFn={fetchArtworkFeed}
      CardComponent={ArtworkFeedCard}
      title="Artwork Feed"
    />
  );
}
