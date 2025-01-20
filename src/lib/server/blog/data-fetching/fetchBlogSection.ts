import { FrontendBlogEntryFull } from "@/lib/types/blogTypes";
import { BlogSection } from "../blogTypes";
import { headers } from "next/headers";

export async function fetchBlogSection(
  section: BlogSection
): Promise<ApiResponse<FrontendBlogEntryFull[]>> {
  const result = await fetch(
    `http://localhost:3000/api/blog/section?section=${encodeURIComponent(
      section
    )}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  console.log("result in fetchBlogAvailability", result);

  if (!result || !result.success) {
    return { success: false, message: "No blog availability found" };
  }

  return { success: true, data: result.data };
}
