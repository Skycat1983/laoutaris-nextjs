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

// a single collection
export type ApiCollectionResult = SingleResult<CollectionFrontend>;
// a list of collections
export type ApiCollectionListResult = ListResult<CollectionFrontend>;
// a single collection with populated artworks
export type ApiCollectionPopulatedResult =
  SingleResult<CollectionFrontendPopulated>;
// export type ApiCollectionArtworkListResult =
//   ListResult<CollectionFrontendPopulated>;

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

  // Get all artworks for a collection
  //? used in artwork pagination
  singleCollectionAllArtwork: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<ApiCollectionPopulatedResult>(
      `/api/v2/public/collection/${encodedSlug}/artwork`
    );
  },

  // Get collection with specific artwork
  // ? used to get a single artwork from a collection, for example when routing to /collections/slug/artworkId
  singleCollectionSingleArtwork: async (slug: string, artworkId: string) => {
    const encodedSlug = encodeURIComponent(slug);
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<ApiCollectionPopulatedResult>(
      `/api/v2/public/collection/${encodedSlug}/artwork/${encodedArtworkId}`
    );
  },
});

// Type for our collection fetchers object
export type CollectionFetchers = ReturnType<typeof createCollectionFetchers>;
