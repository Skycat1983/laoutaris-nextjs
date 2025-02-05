import type { FrontendArticle } from "@/lib/types/articleTypes";
import { headers } from "next/headers";

interface FetchArticlesParams {
  section?: string;
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
