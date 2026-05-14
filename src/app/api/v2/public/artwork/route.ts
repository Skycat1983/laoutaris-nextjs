import { NextRequest, NextResponse } from "next/server";
import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import type {
  ArtworkQueryParams,
  Decade,
  ArtStyle,
  Medium,
  Surface,
  FilterMode,
  SortOption,
} from "@/lib/data/types";
import { getArtworkList } from "@/lib/data/services/getArtworkList";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

const parseArtworkListSearchParams = (
  searchParams: URLSearchParams
): ArtworkQueryParams => ({
  filterMode: (searchParams.get("filterMode") as FilterMode) || "ALL",
  sortBy: (searchParams.get("sortBy") as SortOption) || "mostRecent",
  sortColor: searchParams.get("sortColor") ?? undefined,
  page: parseInt(searchParams.get("page") || "1"),
  limit: parseInt(searchParams.get("limit") || "10"),
  decade: searchParams.getAll("decade") as Decade[],
  artstyle: searchParams.getAll("artstyle") as ArtStyle[],
  medium: searchParams.getAll("medium") as Medium[],
  surface: searchParams.getAll("surface") as Surface[],
});

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  try {
    const userId = await getUserIdFromSession();
    const result = await getArtworkList({
      ...parseArtworkListSearchParams(request.nextUrl.searchParams),
      userId,
    });

    return NextResponse.json(result satisfies ApiArtworkListResult);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error in artwork route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
