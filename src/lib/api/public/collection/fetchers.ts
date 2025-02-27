import type {
  FrontendCollection,
  FrontendCollectionWithArtworks,
} from "@/lib/data/types/collectionTypes";
import { Fetcher } from "../../core/createFetcher";
import { Section } from "@/lib/data/types/articleTypes";

interface FetchCollectionsParams {
  section?: Section;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export const createCollectionFetchers = (fetcher: Fetcher) => ({
  // Get one collection by slug
  fetchCollection: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<FrontendCollection>(
      `/api/v2/public/collection/${encodedSlug}`
    );
  },

  // Get multiple collections by params
  fetchCollections: async ({
    section,
    fields,
    limit = 10,
    page = 1,
  }: FetchCollectionsParams = {}) => {
    const params = new URLSearchParams();
    if (section) params.append("section", section);
    if (fields) params.append("fields", fields.join(","));
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    return fetcher<FrontendCollection[]>(
      `/api/v2/public/collection?${params.toString()}`
    );
  },

  // Get collection with specific artwork
  fetchCollectionArtwork: async (slug: string, artworkId: string) => {
    const encodedSlug = encodeURIComponent(slug);
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<FrontendCollectionWithArtworks>(
      `/api/v2/public/collection/${encodedSlug}/artwork/${encodedArtworkId}`
    );
  },
});

// Type for our collection fetchers object
export type CollectionFetchers = ReturnType<typeof createCollectionFetchers>;
