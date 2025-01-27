import type { FrontendArtworkUnpopulated } from "@/lib/types/artworkTypes";

export async function fetchArtworkFeed(): Promise<
  FrontendArtworkUnpopulated[]
> {
  const response = await fetch("http://localhost:3000/api/admin/artwork/read");

  if (!response.ok) {
    throw new Error("Failed to fetch artwork feed");
  }

  return response.json();
}
