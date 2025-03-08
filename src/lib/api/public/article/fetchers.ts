import type {
  ArticleFrontend,
  ArticleFrontendPopulated,
  FrontendArticle,
  FrontendArticleWithArtwork,
  Section,
  Article,
  ArticlePopulated,
} from "@/lib/data/types/articleTypes";
import { Fetcher } from "../../core/createFetcher";
import {
  SingleResult,
  ListResult,
  ApiResponse,
} from "@/lib/data/types/apiTypes";
import {
  ArticlePopulatedFrontend,
  ArticleTransformations,
} from "@/lib/data/types/transformationTypes";

interface FetchArticlesParams {
  section?: Section;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export type ApiSingleArticleResult = SingleResult<Article>;
export type ApiSingleArticlePopulatedResult = SingleResult<ArticlePopulated>;

// Multiple articles response types
export type ApiArticleListResult = ListResult<Article>;
export type ApiArticlePopulatedListResult = ListResult<ArticlePopulated>;

export const createArticleFetchers = (fetcher: Fetcher) => ({
  // Get one article by slug
  single: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<ApiSingleArticleResult>(
      `/api/v2/public/article/${encodedSlug}`
    );
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
    return fetcher<ApiSingleArticlePopulatedResult>(
      `/api/v2/public/article/${encodedSlug}`
    );
  },
});

// Type for our article fetchers object
export type ArticleFetchers = ReturnType<typeof createArticleFetchers>;
