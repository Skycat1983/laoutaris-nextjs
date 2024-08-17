import { headers } from "next/headers";

interface CollectionLink {
  title: string;
  slug: string;
}

export async function fetchCollectionLinks(
  section: string
): Promise<ApiResponse<CollectionLink[]>> {
  const result = await fetch(
    `http://localhost:3000/api/collection/links?section=${encodeURIComponent(
      section
    )}`,
    {
      // cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  if (!result) {
    return { success: false, message: "Section collection links not found" };
  }
  return { success: true, data: result };
}
