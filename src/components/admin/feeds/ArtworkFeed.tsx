import { getArtworkFeed } from "@/lib/server/admin/use_cases/getArtworkFeed";
import { ArtworkFeedCard } from "./ArtworkFeedCard";

export async function ArtworkFeed() {
  const artworkFeed = await getArtworkFeed();

  return (
    <div className="w-full h-full bg-blue-100 hover:bg-whitish">
      <h1 className="text-4xl font-archivo p-8 mt-8">Artwork Feed</h1>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4">
          {artworkFeed.map((artwork) => (
            <ArtworkFeedCard key={artwork._id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
}
