import { ServerFeed } from "./ServerFeed";
import { getArtworkFeed } from "@/lib/server/admin/use_cases/getArtworkFeed";
import { ArtworkFeedCard } from "./ArtworkFeedCard";

export async function ArtworkFeed() {
  const artworkFeed = await getArtworkFeed();

  const renderCard = (artwork: any) => (
    <ArtworkFeedCard key={artwork._id} artwork={artwork} />
  );

  return (
    <ServerFeed title="Artwork" items={artworkFeed} renderCard={renderCard} />
  );
}
