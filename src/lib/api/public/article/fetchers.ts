import type {
  Section,
  PublicArticle,
  PublicArticleTransformations,
  PublicArticlePopulated,
} from "@/lib/data/types/articleTypes";
import { Fetcher } from "../../core/createFetcher";
import {
  SingleResult,
  ListResult,
  ApiResponse,
} from "@/lib/data/types/apiTypes";

interface FetchArticlesParams {
  section?: Section;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export type ApiArticleResult = SingleResult<PublicArticle>;
export type ApiArticlePopulatedResult = SingleResult<PublicArticlePopulated>;

// Multiple articles response types
export type ApiArticleListResult = ListResult<PublicArticle>;
export type ApiArticlePopulatedListResult = ListResult<PublicArticlePopulated>;

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
