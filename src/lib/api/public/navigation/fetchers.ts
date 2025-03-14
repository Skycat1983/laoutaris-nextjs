import type {
  ArticleNavItem,
  CollectionNavItem,
  CollectionArtworkNavList,
} from "@/lib/data/types/navigationTypes";
import { Fetcher } from "@/lib/api/core/createFetcher";
import { ArticleSection, ListResult } from "@/lib/data/types";

export type ApiArticleNavListResult = ListResult<ArticleNavItem>;
export type ApiCollectionNavListResult = ListResult<CollectionNavItem>;
// export type ApiCollectionArtworkNavListResult = ListResult<CollectionArtworkNavList>;

//TODO: rename these to identify use case, e.g. pagination, subnav link etc
export const createNavigationFetchers = (fetcher: Fetcher) => ({
  // Get article navigation list
  fetchArticleNavigationList: async (section: ArticleSection) => {
    const encodedSection = encodeURIComponent(section);
    return fetcher<ApiArticleNavListResult>(
      `/api/v2/public/navigation/articles/${encodedSection}`
    );
  },

  // Get collection navigation list
  fetchCollectionNavigationList: async () =>
    fetcher<ApiCollectionNavListResult>(
      `/api/v2/public/navigation/collections`
    ),

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
