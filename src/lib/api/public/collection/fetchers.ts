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
  fetchCollection: async (slug: string) =>
    fetcher<FrontendCollection>(`/api/v2/collection/${slug}`),

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

    return fetcher<FrontendCollection[]>(`/api/v2/collection?${params}`);
  },

  // Get collection with specific artwork
  fetchCollectionArtwork: async (slug: string, artworkId: string) =>
    fetcher<FrontendCollectionWithArtworks>(
      `/api/v2/collection/${slug}/artwork/${artworkId}`
    ),
});

// Type for our collection fetchers object
export type CollectionFetchers = ReturnType<typeof createCollectionFetchers>;
