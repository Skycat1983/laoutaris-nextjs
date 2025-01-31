"use server";

import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";
import { fetchBlogFeed } from "../data-fetching/fetchBlogFeed";

// useCase.ts
export async function getBlogFeed() {
  try {
    const blogs: FrontendBlogEntryUnpopulated[] = await fetchBlogFeed();
    return blogs;
  } catch (error) {
    console.error("Blog feed error:", error);
    throw new Error("Failed to get blog feed");
  }
}
