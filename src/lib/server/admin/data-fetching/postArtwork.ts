import { BaseArtwork } from "@/lib/server/models/artworkModel";

interface PostArtworkParams {
  artworkData: Omit<BaseArtwork, "collections" | "watcherlist" | "favourited">;
}

export async function postArtwork({ artworkData }: PostArtworkParams) {
  const response = await fetch("/api/v2/admin/artwork/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artworkData),
  });

  if (!response.ok) {
    throw new Error("Failed to create artwork");
  }

  return response.json();
}
