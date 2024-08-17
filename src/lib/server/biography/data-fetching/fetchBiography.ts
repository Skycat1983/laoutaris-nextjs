import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { headers } from "next/headers";

export async function fetchBiography(
  slug: string
): Promise<ApiResponse<IFrontendArticle>> {
  console.log("slug in fetch biography", slug);

  const result = await fetch(
    `http://localhost:3000/api/biography/slug?slug=${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  console.log("result", result);

  if (!result || !result.success) {
    return { success: false, message: "Article not found" };
  }

  return { success: true, data: result.data };
}
