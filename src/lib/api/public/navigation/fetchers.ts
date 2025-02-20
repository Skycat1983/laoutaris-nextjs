import type {
  ArticleNavItem,
  CollectionNavItem,
  ValidSection,
  CollectionArtworkNavList,
  UserNavItem,
  UserNavResponse,
  UserNavFields,
} from "@/lib/data/types/navigationTypes";
import { Fetcher } from "../../core/createFetcher";

export const createNavigationFetchers = (fetcher: Fetcher) => ({
  // Get article navigation list
  fetchArticleNavigationList: async (section: ValidSection) => {
    const encodedSection = encodeURIComponent(section);
    return fetcher<ArticleNavItem[]>(
      `/api/v2/navigation/articles/${encodedSection}`
    );
  },

  // Get collection navigation list
  fetchCollectionNavigationList: async () =>
    fetcher<CollectionNavItem[]>(`/api/v2/navigation/collections`),

  // Get single collection navigation item
  fetchCollectionNavigationItem: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<CollectionNavItem>(
      `/api/v2/navigation/collections/${encodedSlug}`
    );
  },

  // Get collection artworks navigation
  fetchCollectionArtworksNavigation: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<CollectionArtworkNavList>(
      `/api/v2/navigation/collections/${encodedSlug}/artworks`
    );
  },

  // Add the user navigation fetcher
  fetchUserNavigationList: async () =>
    fetcher<UserNavFields>(`/api/v2/navigation/user`),
});

// Type for our navigation fetchers object
export type NavigationFetchers = ReturnType<typeof createNavigationFetchers>;
