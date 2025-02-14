import { FrontendBlogEntryUnpopulated } from "@/lib/data/types/blogTypes";
import { headers } from "next/headers";

export async function fetchBlogEntry(
  slug: string
): Promise<ApiResponse<FrontendBlogEntryUnpopulated>> {
  console.log("slug in fetch biography", slug);

  const response = await fetch(
    `http://localhost:3000/api/blog/slug?slug=${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  const result = await response.json();

  console.log("result", result);

  if (!result || !result.success) {
    return { success: false, message: "Blog entry not found" };
  }

  return { success: true, data: result.data };
}
