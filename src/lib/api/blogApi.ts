import type { FrontendBlogEntry } from "@/lib/types/blogTypes";
import { headers } from "next/headers";

interface FetchBlogEntriesParams {
  sortby?: "latest" | "oldest" | "popular" | "featured";
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export async function fetchBlogEntries({
  sortby = "latest",
  fields,
  limit,
  page,
}: FetchBlogEntriesParams = {}): Promise<
  PaginatedResponse<FrontendBlogEntry[]>
> {
  const params = new URLSearchParams();

  if (sortby) params.append("sortby", sortby);
  if (fields) params.append("fields", fields.join(","));
  if (limit) params.append("limit", limit.toString());
  if (page) params.append("page", page.toString());

  const response = await fetch(`${process.env.BASEURL}/api/v2/blog?${params}`, {
    method: "GET",
    headers: headers(),
  });

  const result = (await response.json()) as PaginatedResponse<
    FrontendBlogEntry[]
  >;
  if (!result.success) {
    throw new Error("Failed to fetch blog entries");
  }

  return result;
}
