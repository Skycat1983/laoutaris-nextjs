import { FrontendArtworkUnpopulated } from "@/lib/types/artworkTypes";

interface PostArtworkParams {
  artworkData: Omit<FrontendArtworkUnpopulated, "_id">;
}

export async function postArtwork({ artworkData }: PostArtworkParams) {
  const response = await fetch("/api/admin/artwork/create", {
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
