import type {
  ArticleNavItem,
  CollectionNavItem,
  ValidSection,
  CollectionArtworkNavList,
} from "@/lib/data/types/navigationTypes";
import { Fetcher } from "@/lib/api/core/createFetcher";

export const createNavigationFetchers = (fetcher: Fetcher) => ({
  // Get article navigation list
  fetchArticleNavigationList: async (section: ValidSection) => {
    const encodedSection = encodeURIComponent(section);
    return fetcher<ArticleNavItem[]>(
      `/api/v2/public/navigation/articles/${encodedSection}`
    );
  },

  // Get collection navigation list
  fetchCollectionNavigationList: async () =>
    fetcher<CollectionNavItem[]>(`/api/v2/public/navigation/collections`),

  // Get single collection navigation item
  fetchCollectionNavigationItem: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<CollectionNavItem>(
      `/api/v2/public/navigation/collections/${encodedSlug}`
    );
  },

  // Get collection artworks navigation
  fetchCollectionArtworksNavigation: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<CollectionArtworkNavList>(
      `/api/v2/public/navigation/collections/${encodedSlug}/artworks`
    );
  },
});

// Type for our navigation fetchers object
export type NavigationFetchers = ReturnType<typeof createNavigationFetchers>;
