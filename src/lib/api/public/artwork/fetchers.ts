import {
  FrontendArtworkUnpopulated,
  ArtworkQueryParams,
  PublicFrontendArtwork,
  ListResult,
  SingleResult,
} from "@/lib/data/types";
import { Fetcher } from "../../core/createFetcher";

export type PublicArtworkResult = SingleResult<PublicFrontendArtwork>;
export type PublicArtworkListResult = ListResult<PublicFrontendArtwork>;

export const createArtworkFetchers = (fetcher: Fetcher) => ({
  fetchArtworks: async (
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

    return fetcher<PublicArtworkListResult>(url);
  },

  // Get one artwork by id
  fetchArtwork: async (id: string) => {
    return fetcher<PublicArtworkResult>(`/api/v2/public/artwork/${id}`);
  },
});
