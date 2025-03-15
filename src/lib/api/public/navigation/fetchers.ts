import type {
  ArticleNavDataFrontend,
  CollectionNavDataFrontend,
  ArticleSection,
  ListResult,
  SingleResult,
} from "@/lib/data/types";
import { Fetcher } from "@/lib/api/core/createFetcher";

export type ApiArticleNavListResult = ListResult<ArticleNavDataFrontend>;
export type ApiCollectionNavItemResult =
  SingleResult<CollectionNavDataFrontend>;

export type ApiCollectionNavListResult = ListResult<CollectionNavDataFrontend>;
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
    return fetcher<ApiCollectionNavItemResult>(
      `/api/v2/public/navigation/collections/${encodedSlug}`
    );
  },

  // Get collection artworks navigation
  fetchCollectionArtworksNavigation: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<CollectionNavDataFrontend>(
      `/api/v2/public/navigation/collections/${encodedSlug}/artworks`
    );
  },
});

// Type for our navigation fetchers object
export type NavigationFetchers = ReturnType<typeof createNavigationFetchers>;
