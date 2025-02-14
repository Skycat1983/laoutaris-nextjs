"use server";

import type { FrontendArticleWithArtwork } from "@/lib/data/types/articleTypes";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import type { FrontendCollection } from "@/lib/data/types/collectionTypes";
import { headers } from "next/headers";
import { FrontendArtwork } from "../../data/types/artworkTypes";

interface PaginationParams {
  page?: number;
  limit?: number;
}

export async function fetchArticleFeed(
  params: PaginationParams = {}
): Promise<PaginatedResponse<FrontendArticleWithArtwork[]>> {
  const { page = 1, limit = 10 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(
    `http://localhost:3000/api/v2/admin/article/list?${searchParams}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch article feed");
  }

  return response.json();
}

export async function fetchArtworkFeed(
  params: PaginationParams = {}
): Promise<PaginatedResponse<FrontendArtwork[]>> {
  const { page = 1, limit = 10 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(
    `http://localhost:3000/api/v2/admin/artwork/list?${searchParams}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch artwork feed");
  }

  return response.json();
}

export async function fetchBlogFeed(
  params: PaginationParams = {}
): Promise<PaginatedResponse<FrontendBlogEntry[]>> {
  const { page = 1, limit = 10 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(
    `http://localhost:3000/api/v2/admin/blog/list?${searchParams}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch blog feed");
  }

  return response.json();
}

export async function fetchCollectionFeed(
  params: PaginationParams = {}
): Promise<PaginatedResponse<FrontendCollection[]>> {
  const { page = 1, limit = 10 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(
    `http://localhost:3000/api/v2/admin/collection/list?${searchParams}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch collection feed");
  }

  return response.json();
}
