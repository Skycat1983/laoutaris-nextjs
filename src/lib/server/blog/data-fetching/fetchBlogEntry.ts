import { FrontendBlogEntry } from "@/lib/types/blogTypes";
import { headers } from "next/headers";

export async function fetchBlogEntry(
  slug: string
): Promise<ApiResponse<FrontendBlogEntry>> {
  console.log("slug in fetch biography", slug);

  const result = await fetch(
    `http://localhost:3000/api/blog/slug?slug=${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  console.log("result", result);

  if (!result || !result.success) {
    return { success: false, message: "Blog entry not found" };
  }

  return { success: true, data: result.data };
}
