import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";

export async function fetchBlogFeed(): Promise<FrontendBlogEntryUnpopulated[]> {
  const response = await fetch("http://localhost:3000/api/admin/blog/read");

  if (!response.ok) {
    throw new Error("Failed to fetch blog feed");
  }

  return response.json();
}
