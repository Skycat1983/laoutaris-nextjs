import { SortByType } from "../../../../../unused/blog_routes_old/route";
import { FrontendBlogEntryUnpopulated } from "@/lib/data/types/blogTypes";
import { headers } from "next/headers";

interface BlogData {
  page: number;
  limit: number;
  total: number;
  results: FrontendBlogEntryUnpopulated[];
}

export async function fetchBlogEntriesSortedBy(
  sortby: SortByType,
  page: number
): Promise<ApiResponse<BlogData>> {
  const result = await fetch(
    `http://localhost:3000/api/blog?sortby=${encodeURIComponent(
      sortby
    )}&page=${page}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  if (!result || !result.results) {
    return { success: false, message: "No blog entries found" };
  }

  return { success: true, data: result };
}
