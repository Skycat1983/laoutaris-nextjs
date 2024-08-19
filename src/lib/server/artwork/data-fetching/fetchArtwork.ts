import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { headers } from "next/headers";

export async function fetchArtwork(
  id: string
): Promise<ApiResponse<IFrontendArtwork>> {
  console.log("slug in fetch artwork", id);

  const result = await fetch(
    `http://localhost:3000/api/artwork/id?id=${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  console.log("result", result);

  if (!result || !result.success) {
    return { success: false, message: "Artwork not found" };
  }

  return { success: true, data: result.data };
}
