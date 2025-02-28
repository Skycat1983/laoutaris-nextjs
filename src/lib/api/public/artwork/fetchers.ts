import {
  ArtStyle,
  Decade,
  FrontendArtwork,
  FrontendArtworkUnpopulated,
  Medium,
  Surface,
  FilterMode,
  ArtworkFilterParams,
} from "@/lib/data/types";
import { Fetcher } from "../../core/createFetcher";

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
    }: ArtworkFilterParams = {
      filterMode: "ALL",
    }
  ) => {
    console.log("fetchArtworks", {
      limit,
      page,
      decade,
      artstyle,
      medium,
      surface,
      filterMode,
    });
    const params = new URLSearchParams();

    if (filterMode) params.append("filterMode", filterMode);

    // Handle arrays of values
    const appendArrayParam = (
      key: string,
      value: string | string[] | undefined
    ) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.append(key, value);
      }
    };

    appendArrayParam("decade", decade);
    appendArrayParam("artstyle", artstyle);
    appendArrayParam("medium", medium);
    appendArrayParam("surface", surface);

    // Add pagination and field selection
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    return fetcher<FrontendArtworkUnpopulated[]>(
      `/api/v2/public/artwork?${params.toString()}`
    );
  },

  // Get one artwork by id
  fetchArtwork: async (id: string) => {
    return fetcher<FrontendArtworkUnpopulated>(`/api/v2/public/artwork/${id}`);
  },
});
