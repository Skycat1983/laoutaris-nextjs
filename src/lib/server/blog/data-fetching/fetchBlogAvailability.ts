import { headers } from "next/headers";
import { BlogAvailability, BlogSection } from "../blogTypes";

export async function fetchBlogAvailability(
  section: BlogSection
): Promise<ApiResponse<BlogAvailability>> {
  const result = await fetch(
    `http://localhost:3000/api/blog/availability?section=${encodeURIComponent(
      section
    )}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  if (!result || !result.success) {
    return { success: false, message: "No blog availability found" };
  }

  return { success: true, data: result.data };
}
