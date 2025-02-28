import {
  ArtStyle,
  Decade,
  FrontendArtwork,
  FrontendArtworkUnpopulated,
  Medium,
  Surface,
  FilterMode,
} from "@/lib/data/types";
import { Fetcher } from "../../core/createFetcher";

interface FetchArtworkParams {
  decade?: Decade;
  artstyle?: ArtStyle;
  medium?: Medium;
  surface?: Surface;
  filterMode?: FilterMode;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export const createArtworkFetchers = (fetcher: Fetcher) => ({
  fetchArtworks: async ({
    fields,
    limit = 10,
    page = 1,
    decade,
    artstyle,
    medium,
    surface,
    filterMode,
  }: FetchArtworkParams = {}) => {
    console.log("fetchArtworks", {
      fields,
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

    // Add pagination and field selection
    if (fields) params.append("fields", fields.join(","));
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    // Add filter parameters
    if (decade) params.append("decade", decade);
    if (artstyle) params.append("artstyle", artstyle);
    if (medium) params.append("medium", medium);
    if (surface) params.append("surface", surface);

    return fetcher<FrontendArtworkUnpopulated[]>(
      `/api/v2/public/artwork?${params.toString()}`
    );
  },

  // Get one artwork by id
  fetchArtwork: async (id: string) => {
    return fetcher<FrontendArtworkUnpopulated>(`/api/v2/public/artwork/${id}`);
  },
});
