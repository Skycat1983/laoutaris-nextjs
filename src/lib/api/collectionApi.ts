import { headers } from "next/headers";
import { Section } from "../types/articleTypes";
import {
  FrontendCollection,
  FrontendCollectionWithArtworks,
} from "../types/collectionTypes";

interface FetchCollectionsParams {
  section?: Section;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export async function fetchCollections({
  section,
  fields,
  limit = 10,
  page = 1,
}: FetchCollectionsParams = {}) {
  const params = new URLSearchParams();

  if (section) params.append("section", section);
  if (fields) params.append("fields", fields.join(","));
  if (limit) params.append("limit", limit.toString());
  if (page) params.append("page", page.toString());

  const response = await fetch(
    `${process.env.BASEURL}/api/v2/collection?${params}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  const result = (await response.json()) as ApiResponse<FrontendCollection[]>;
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch collections");
  }

  return result.data;
}

export async function fetchCollectionArtwork(
  slug: string,
  artworkId: string
): Promise<FrontendCollectionWithArtworks> {
  try {
    const response = await fetch(
      `${process.env.BASEURL}/api/v2/collection/${slug}/artwork/${artworkId}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch artwork");
    }

    const result =
      (await response.json()) as ApiResponse<FrontendCollectionWithArtworks>;
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch artwork");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching artwork:", error);
    throw error;
  }
}
