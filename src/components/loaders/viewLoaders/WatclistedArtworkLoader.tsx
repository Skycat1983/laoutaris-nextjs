import ArtworkView from "@/components/views/ArtworkView";
import { fetchUserWatchlistArtwork } from "@/lib/api/public/userApi";

export default async function WatchlistedArtworkLoader({
  artworkId,
}: {
  artworkId: string;
}) {
  const result = await fetchUserWatchlistArtwork(artworkId);

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch watchlisted artwork");
  }

  const { data } = result;

  console.log("data in watchlisted artwork", data);

  return (
    <>
      <ArtworkView {...data} />
      {/* <ArtInfoTabs {...artworkData} /> */}
    </>
  );
}
