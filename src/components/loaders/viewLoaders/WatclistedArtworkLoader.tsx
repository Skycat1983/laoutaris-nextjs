import { ArtworkView } from "@/components/views/ArtworkView";
import { serverApi } from "@/lib/api/serverApi";

export async function WatchlistedArtworkLoader({
  artworkId,
}: {
  artworkId: string;
}) {
  const result = await serverApi.user.watchlist.getOne(artworkId);

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
