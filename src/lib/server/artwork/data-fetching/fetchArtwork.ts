import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { headers } from "next/headers";

// TODO: caching issue ? i want to cache the artwork but not the watchlist
// ! middleware could be the solution
export async function fetchArtwork(
  id: string
): Promise<ApiResponse<IFrontendArtwork>> {
  const result = await fetch(
    `http://localhost:3000/api/artwork/id?id=${encodeURIComponent(id)}`,
    {
      // cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  // console.log("result", result);

  if (!result || !result.success) {
    return { success: false, message: "Artwork not found" };
  }

  return { success: true, data: result.data };
}
