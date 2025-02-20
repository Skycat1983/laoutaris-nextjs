import type {
  FrontendArticle,
  FrontendArticleWithArtwork,
  Section,
} from "@/lib/data/types/articleTypes";
import { headers } from "next/headers";

export async function fetchArticle(slug: string) {
  const response = await fetch(
    `${process.env.BASEURL}/api/v2/article/${slug}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  const result = (await response.json()) as ApiResponse<FrontendArticle>;
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch article");
  }

  return result.data;
}

interface FetchArticlesParams {
  section?: Section;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export async function fetchArticles({
  section,
  fields,
  limit = 10,
  page = 1,
}: FetchArticlesParams = {}) {
  const params = new URLSearchParams();

  if (section) params.append("section", section);
  if (fields) params.append("fields", fields.join(","));
  if (limit) params.append("limit", limit.toString());
  if (page) params.append("page", page.toString());

  const response = await fetch(
    `${process.env.BASEURL}/api/v2/article?${params}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  const result = (await response.json()) as ApiResponse<FrontendArticle[]>;
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch articles");
  }

  return result.data;
}

export async function fetchArticleArtwork(slug: string) {
  const response = await fetch(
    `${process.env.BASEURL}/api/v2/article/${slug}/artwork`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  const result =
    (await response.json()) as ApiResponse<FrontendArticleWithArtwork>;
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch article artwork");
  }

  return result.data;
}
