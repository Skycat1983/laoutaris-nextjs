import type {
  Collection,
  CollectionPopulated,
} from "@/lib/data/types/collectionTypes";
import { Fetcher } from "../../core/createFetcher";
import { Section } from "@/lib/data/types/articleTypes";
import { ListResult, SingleResult } from "@/lib/data/types";

interface FetchCollectionsParams {
  section?: Section;
  // fields?: readonly string[];
  limit?: number;
  page?: number;
}

export type ApiCollectionResult = SingleResult<PublicCollection>;
export type ApiCollectionListResult = ListResult<PublicCollection>;
export type ApiCollectionPopulatedResult = SingleResult<CollectionPopulated>;

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
