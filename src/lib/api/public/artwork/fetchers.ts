import {
  ArtworkQueryParams,
  ListResult,
  PublicArtwork,
  SingleResult,
} from "@/lib/data/types";
import { Fetcher } from "../../core/createFetcher";

export type ApiArtworkResult = SingleResult<PublicArtwork>;
export type ApiArtworkListResult = ListResult<PublicArtwork>;

export const createArtworkFetchers = (fetcher: Fetcher) => ({
  // Get one artwork by id
  single: async (id: string) => {
    return fetcher<ApiArtworkResult>(`/api/v2/public/artwork/${id}`);
  },

  // Get multiple artworks by params
  multiple: async (
    {
      limit = 10,
      page = 1,
      decade,
      artstyle,
      medium,
      surface,
      filterMode,
      sortBy,
      sortColor,
    }: ArtworkQueryParams = {
      filterMode: "ALL",
    }
  ) => {
    const params = new URLSearchParams();

    // Add sort params first for clarity
    if (sortBy) params.append("sortBy", sortBy);
    if (sortColor && sortBy === "colorProximity") {
      params.append("sortColor", sortColor);
    }

    // Add filter mode
    if (filterMode) params.append("filterMode", filterMode);

    // Handle arrays of values
    const appendArrayParam = (key: string, value: string[] | undefined) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      }
    };

    appendArrayParam("decade", decade);
    appendArrayParam("artstyle", artstyle);
    appendArrayParam("medium", medium);
    appendArrayParam("surface", surface);

    // Add pagination
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    const url = `/api/v2/public/artwork?${params.toString()}`;
    console.log("Fetching URL:", url);

    return fetcher<ApiArtworkListResult>(url);
  },
});
