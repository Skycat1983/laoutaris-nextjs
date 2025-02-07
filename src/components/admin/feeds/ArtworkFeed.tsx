import { ArtworkFeedCard } from "./ArtworkFeedCard";
import { RefreshButton } from "./RefreshButton";
import { fetchArtworkFeed } from "@/lib/api/feedApi";

export async function ArtworkFeed() {
  const { data } = await fetchArtworkFeed();

  console.log("data", data);

  return (
    <div className="w-full h-full hover:bg-whitish border-l-2">
      <div className="flex flex-row items-center pt-8 border-b-2">
        <h1 className="text-4xl font-archivo font-semibold p-8">Feed</h1>
        <RefreshButton />
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4 gap-8">
          {data.map((artwork) => (
            <ArtworkFeedCard key={artwork._id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
}
