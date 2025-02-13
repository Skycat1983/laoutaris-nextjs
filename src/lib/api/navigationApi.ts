import { headers } from "next/headers";
import {
  ArticleNavItem,
  ArticleNavResponse,
  ValidSection,
  CollectionNavItem,
  CollectionNavListResponse,
  CollectionNavItemResponse,
  CollectionArtworksNavResponse,
  ArtworkNavFields,
} from "../types/navigationTypes";

export async function fetchArticleNavigationList(
  section: ValidSection
): Promise<ArticleNavItem[]> {
  const url = `${process.env.BASEURL}/api/v2/navigation/articles/${section}`;

  const response = await fetch(url, {
    method: "GET",
    headers: headers(),
    cache: "no-store",
  });

  // Log status and response for debugging
  // console.log("Response status:", response.status);
  const text = await response.text();
  // console.log("Response text:", text);

  try {
    const result = JSON.parse(text) as ArticleNavResponse;
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch article navigation");
    }
    return result.data;
  } catch (error) {
    console.error("Error parsing response:", error);
    throw error;
  }
}

export async function fetchCollectionNavigationList(
  section: ValidSection
): Promise<CollectionNavItem[]> {
  const url = `${process.env.BASEURL}/api/v2/navigation/collections`;
  console.log("Fetching from:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: headers(),
    cache: "no-store",
  });

  const text = await response.text();
  // console.log("Response text:", text);

  try {
    const result = JSON.parse(text) as CollectionNavListResponse;
    if (!result.success) {
      throw new Error(
        result.error || "Failed to fetch collection navigation list"
      );
    }
    return result.data;
  } catch (error) {
    console.error("Error parsing response:", error);
    throw error;
  }
}

export async function fetchCollectionNavigationItem(
  slug: string
): Promise<CollectionNavItem> {
  const url = `${process.env.BASEURL}/api/v2/navigation/collections/${slug}`;
  console.log("Fetching from:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: headers(),
    cache: "no-store",
  });

  // console.log("Response status:", response.status);
  const text = await response.text();
  // console.log("Response text:", text);

  try {
    const result = JSON.parse(text) as CollectionNavItemResponse;
    if (!result.success) {
      throw new Error(
        result.error || "Failed to fetch collection navigation item"
      );
    }
    return result.data;
  } catch (error) {
    console.error("Error parsing response:", error);
    throw error;
  }
}

export async function fetchCollectionArtworksNavigation(
  slug: string
): Promise<ArtworkNavFields[]> {
  const url = `${process.env.BASEURL}/api/v2/navigation/collections/${slug}/artworks`;
  console.log("Fetching from:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: headers(),
    cache: "no-store",
  });

  // console.log("Response status:", response.status);
  const text = await response.text();
  // console.log("Response text:", text);

  try {
    const result = JSON.parse(text) as CollectionArtworksNavResponse;
    if (!result.success) {
      throw new Error(
        result.error || "Failed to fetch collection artworks navigation"
      );
    }
    return result.data.artworks;
  } catch (error) {
    console.error("Error parsing response:", error);
    throw error;
  }
}
