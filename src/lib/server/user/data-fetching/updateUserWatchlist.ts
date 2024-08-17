import { headers } from "next/headers";

export async function updateUserWatchlist(
  artworkId: string
): Promise<ApiResponse<{ message: string }>> {
  const result = await fetch(`http://localhost:3000/api/user/watchlist`, {
    cache: "no-cache",
    method: "PATCH",
    body: JSON.stringify({ artworkId }), // Send the artworkId in the body
  }).then((res) => res.json());

  if (!result || !result.success) {
    return {
      success: false,
      message: result.message || "Failed to update watchlist",
    };
  }

  return { success: true, data: { message: result.message } };
}
