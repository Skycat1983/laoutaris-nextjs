import { CollectionSection } from "@/lib/constants";
import { Fetcher } from "../../core/createFetcher";
import { ListResult, SingleResult } from "@/lib/data/types";
import {
  CollectionFrontend,
  CollectionFrontendPopulated,
} from "@/lib/data/types/collectionTypes";
interface FetchCollectionsParams {
  section?: CollectionSection;
  // fields?: readonly string[];
  limit?: number;
  page?: number;
}

export type ApiCollectionResult = SingleResult<CollectionFrontend>;
export type ApiCollectionListResult = ListResult<CollectionFrontend>;
export type ApiCollectionPopulatedResult =
  SingleResult<CollectionFrontendPopulated>;

export const createCollectionFetchers = (fetcher: Fetcher) => ({
  // Get one collection by slug
  single: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<ApiCollectionResult>(
      `/api/v2/public/collection/${encodedSlug}`
    );
  },

  // Get multiple collections by params
  multiple: async ({
    section,
    // fields,
    limit = 10,
    page = 1,
  }: FetchCollectionsParams = {}) => {
    const params = new URLSearchParams();
    if (section) params.append("section", section);
    // if (fields) params.append("fields", fields.join(","));
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    return fetcher<ApiCollectionListResult>(
      `/api/v2/public/collection?${params.toString()}`
    );
  },

  // Get collection with specific artwork
  singlePopulated: async (slug: string, artworkId: string) => {
    const encodedSlug = encodeURIComponent(slug);
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<ApiCollectionPopulatedResult>(
      `/api/v2/public/collection/${encodedSlug}/artwork/${encodedArtworkId}`
    );
  },
});

// Type for our collection fetchers object
export type CollectionFetchers = ReturnType<typeof createCollectionFetchers>;
