import type { FrontendBlogEntry } from "@/lib/types/blogTypes";
import HomeBlogSection from "../homepageSections/HomeBlogSection";
import { headers } from "next/headers";

export type BlogCardData = Pick<
  FrontendBlogEntry,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

async function fetchLatestBlogs(): Promise<BlogCardData[]> {
  const selectedFields = ["title", "subtitle", "slug", "imageUrl"].join(",");
  const response = await fetch(
    `${process.env.BASEURL}/api/v2/blog?sortby=latest&limit=4&fields=${selectedFields}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error("Failed to fetch latest blog entries");
  }

  return result.data;
}

export async function HomeBlogSectionLoader() {
  const blogs = await fetchLatestBlogs();
  // resolvers go here if/when needed

  return <HomeBlogSection blogs={blogs} />;
}
