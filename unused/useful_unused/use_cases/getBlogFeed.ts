"use server";

import { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { fetchBlogFeed } from "../../lib/server/admin/data-fetching/fetchBlogFeed";

// useCase.ts
export async function getBlogFeed() {
  try {
    const blogs: FrontendBlogEntry[] = await fetchBlogFeed();
    return blogs;
  } catch (error) {
    console.error("Blog feed error:", error);
    throw new Error("Failed to get blog feed");
  }
}
