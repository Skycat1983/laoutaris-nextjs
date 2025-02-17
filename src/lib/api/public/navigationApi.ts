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
  UserNavResponse,
} from "../../data/types/navigationTypes";

export async function fetchArticleNavigationList(
  section: ValidSection
): Promise<ArticleNavItem[]> {
  const url = `${process.env.BASEURL}/api/v2/navigation/articles/${section}`;

  const response = await fetch(url, {
    method: "GET",
    headers: headers(),
    cache: "no-store",
  });

  const text = await response.text();

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

// the type should Pick
// export type CollectionRouteData = Pick<
//   FrontendCollection,
//   "title" | "slug" | "artworks"
// >;

// type CollectionRouteDataResponse = ApiResponse<CollectionRouteData[]>;

export async function fetchCollectionNavigationList(
  section: ValidSection
): Promise<CollectionNavItem[]> {
  const url = `${process.env.BASEURL}/api/v2/navigation/collections`;
  console.log("Fetching from in fetchCollectionNavigationList:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: headers(),
    cache: "no-store",
  });

  // console.log("response", response);

  const text = await response.text();
  // console.log("Response text:", text);

  try {
    const result = JSON.parse(text) as CollectionNavListResponse;
    if (!result.success) {
      throw new Error(
        result.error || "Failed to fetch collection navigation list"
      );
    }
    // console.log("result.data in fetchCollectionNavigationList:", result.data);
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
  // console.log("Fetching from in fetchCollectionNavigationItem:", url);

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

// used in pagination
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

  const text = await response.text();

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

export async function fetchUserNavigationList(): Promise<UserNavResponse> {
  const url = `${process.env.BASEURL}/api/v2/navigation/user`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers(),
      cache: "no-store",
    });

    const text = await response.text();
    const result = JSON.parse(text) as UserNavResponse;
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch user navigation list");
    }
    return result;
  } catch (error) {
    console.error("Error fetching user navigation list:", error);
    throw error;
  }
}
