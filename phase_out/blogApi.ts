import type {
  FrontendBlogEntry,
  FrontendBlogEntryWithCommentAuthor,
  FrontendBlogEntryWithComments,
} from "@/lib/data/types/blogTypes";
import { headers } from "next/headers";

interface FetchBlogEntriesParams {
  sortby?: "latest" | "oldest" | "popular" | "featured";
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export async function fetchBlogEntries({
  sortby = "latest",
  fields,
  limit,
  page,
}: FetchBlogEntriesParams = {}): Promise<ApiResponse<FrontendBlogEntry[]>> {
  try {
    const params = new URLSearchParams();
    if (sortby) params.append("sortby", sortby);
    if (fields) params.append("fields", fields.join(","));
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    const response = await fetch(
      `${process.env.BASEURL}/api/v2/blog?${params}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: "Failed to fetch blog entries",
      } satisfies ApiErrorResponse;
    }

    return result satisfies ApiSuccessResponse<FrontendBlogEntry[]>;
  } catch (error) {
    console.error("Error fetching blog entries:", error);
    return {
      success: false,
      error: "Failed to fetch blog entries",
    } satisfies ApiErrorResponse;
  }
}

export async function fetchBlog(
  slug: string
): Promise<ApiResponse<FrontendBlogEntry>> {
  try {
    const response = await fetch(`${process.env.BASEURL}/api/v2/blog/${slug}`, {
      method: "GET",
      headers: headers(),
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch blog",
      } satisfies ApiErrorResponse;
    }

    return result satisfies ApiSuccessResponse<FrontendBlogEntry>;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return {
      success: false,
      error: "Failed to fetch blog",
    } satisfies ApiErrorResponse;
  }
}

export async function fetchBlogComments(
  slug: string
): Promise<FrontendBlogEntryWithComments> {
  const response = await fetch(
    `${process.env.BASEURL}/api/v2/blog/${slug}/comments`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  const result =
    (await response.json()) as ApiResponse<FrontendBlogEntryWithComments>;

  if (!result.success) {
    throw new Error("Failed to fetch blog comments");
  }

  return result.data;
}

export async function fetchBlogWithCommentAuthor(
  slug: string
): Promise<ApiResponse<FrontendBlogEntryWithCommentAuthor>> {
  try {
    const response = await fetch(
      `${process.env.BASEURL}/api/v2/blog/${slug}/comments/author`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch blog with comments",
      } satisfies ApiErrorResponse;
    }

    return result satisfies ApiSuccessResponse<FrontendBlogEntryWithCommentAuthor>;
  } catch (error) {
    console.error("Error fetching blog with comments:", error);
    return {
      success: false,
      error: "Failed to fetch blog with comments",
    } satisfies ApiErrorResponse;
  }
}
