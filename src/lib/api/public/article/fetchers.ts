import type {
  ArticleFrontend,
  ArticleFrontendPopulated,
} from "@/lib/data/types/articleTypes";
import { Fetcher } from "../../core/createFetcher";
import { SingleResult, ListResult } from "@/lib/data/types/apiTypes";
import { ArticleSection } from "@/lib/constants";

interface FetchArticlesParams {
  section?: ArticleSection;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export type ApiArticleResult = SingleResult<ArticleFrontend>;
export type ApiArticlePopulatedResult = SingleResult<ArticleFrontendPopulated>;

// Multiple articles response types
export type ApiArticleListResult = ListResult<ArticleFrontend>;
export type ApiArticlePopulatedListResult =
  ListResult<ArticleFrontendPopulated>;

export const createArticleFetchers = (fetcher: Fetcher) => ({
  // Get one article by slug
  single: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<ApiArticleResult>(`/api/v2/public/article/${encodedSlug}`);
  },

  // Get multiple articles by params
  multiple: async ({
    section,
    fields,
    limit = 10,
    page = 1,
  }: FetchArticlesParams = {}) => {
    const params = new URLSearchParams();
    if (section) params.append("section", section);
    if (fields) params.append("fields", fields.join(","));
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    return fetcher<ApiArticleListResult>(`/api/v2/public/article?${params}`);
  },

  // Get article with artwork
  singlePopulated: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<ApiArticlePopulatedResult>(
      `/api/v2/public/article/${encodedSlug}`
    );
  },
});

// Type for our article fetchers object
export type ArticleFetchers = ReturnType<typeof createArticleFetchers>;
