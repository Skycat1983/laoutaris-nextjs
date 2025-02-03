import { SortByType } from "@/app/api/blog/route";
import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";
import { headers } from "next/headers";

export async function fetchBlogEntriesSortedBy(
  sortby: SortByType
): Promise<ApiResponse<FrontendBlogEntryUnpopulated[]>> {
  const result = await fetch(
    `http://localhost:3000/api/blog?sortby=${encodeURIComponent(sortby)}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  if (!result || !result.results) {
    return { success: false, message: "No blog entries found" };
  }

  return { success: true, data: result.results };
}
