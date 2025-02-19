import type {
  FrontendArticle,
  FrontendArticleWithArtwork,
  Section,
} from "@/lib/data/types/articleTypes";
import { Fetcher } from "../../core/createFetcher";

interface FetchArticlesParams {
  section?: Section;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export const createArticleFetchers = (fetcher: Fetcher) => ({
  // Get one article by slug
  fetchArticle: async (slug: string) =>
    fetcher<FrontendArticle>(`/api/v2/article/${slug}`),

  // Get multiple articles by params
  fetchArticles: async ({
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

    return fetcher<FrontendArticle[]>(`/api/v2/article?${params}`);
  },

  // Get article with artwork
  fetchArticleArtwork: async (slug: string) =>
    fetcher<FrontendArticleWithArtwork>(`/api/v2/article/${slug}/artwork`),
});

// Type for our article fetchers object
export type ArticleFetchers = ReturnType<typeof createArticleFetchers>;
