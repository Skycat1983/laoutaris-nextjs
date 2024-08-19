import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";
import { headers } from "next/headers";

export async function fetchCollection(
  slug: string
): Promise<ApiResponse<IFrontendCollection>> {
  console.log("slug in fetch collection", slug);

  const result = await fetch(
    `http://localhost:3000/api/collection/slug?slug=${encodeURIComponent(
      slug
    )}`,
    {
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  console.log("result", result);

  if (!result || !result.success) {
    return { success: false, message: "Collection not found" };
  }

  return { success: true, data: result.data };
}
