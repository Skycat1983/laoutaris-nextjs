import { headers } from "next/headers";

interface ArtworkPaginationLink {
  id: string;
  imageData: {
    secure_url: string;
    pixelHeight: number;
    pixelWidth: number;
  };
}

export async function fetchArtworkLinks(
  collectionSlug: string
): Promise<ApiResponse<ArtworkPaginationLink[]>> {
  const result = await fetch(
    `http://localhost:3000/api/artwork/links?collectionSlug=${encodeURIComponent(
      collectionSlug
    )}`,
    {
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  const { data } = result;

  if (!result) {
    return { success: false, message: "Section artwork links not found" };
  }
  return { success: true, data: data };
}
