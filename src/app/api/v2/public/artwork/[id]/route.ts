import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { ApiArtworkResult } from "@/lib/api/public/artwork/fetchers";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { isNextError } from "@/lib/helpers/isNextError";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ApiArtworkResult>> {
  const { id } = params;

  try {
    const userId = await getUserIdFromSession();
    const artwork = await getArtworkById(id, userId);

    if (!artwork)
      return apiErrorResponse({
        message: "Artwork not found",
        status: 404,
      });

    return apiSuccessResponse<ApiArtworkResult["data"]>(artwork);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching public artwork:", error);
    return apiErrorResponse({
      message: "Failed to fetch artwork",
      status: 500,
    });
  }
}
