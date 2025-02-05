import { fetchBlogEntries } from "@/lib/api/blogApi";
import { transformToPick } from "@/lib/transforms/dataTransforms";
import type { FrontendBlogEntry } from "@/lib/types/blogTypes";
import BlogEntriesView from "@/components/views/BlogEntriesView";

// 1. Config Constants
const BLOG_ENTRIES_CONFIG = {
  fields: [
    "title",
    "subtitle",
    "slug",
    "imageUrl",
    "summary",
    "displayDate",
    "tags",
  ] as const,
  limit: 6,
} as const;

// 2. Type Definitions
type BlogEntryData = Pick<
  FrontendBlogEntry,
  (typeof BLOG_ENTRIES_CONFIG.fields)[number]
>;

interface BlogEntriesLoaderProps {
  sortby: "latest" | "oldest" | "popular" | "featured";
  page: number;
}

// 3. Transform Functions
function transformPaginationData(
  page: number,
  limit: number,
  total: number,
  sortby: string
) {
  return {
    prev: page > 1 ? `/blog/${sortby}?page=${page - 1}` : null,
    next: page * limit < total ? `/blog/${sortby}?page=${page + 1}` : null,
  };
}

// 4. Loader Function
export async function BlogEntriesLoader({
  sortby,
  page,
}: BlogEntriesLoaderProps) {
  try {
    // Fetch data using API layer
    const { data: blogs, metadata } = await fetchBlogEntries({
      sortby,
      page,
      limit: BLOG_ENTRIES_CONFIG.limit,
      fields: BLOG_ENTRIES_CONFIG.fields,
    });

    // Transform blog entries
    const transformedBlogs = blogs.map((blog) =>
      transformToPick(blog, BLOG_ENTRIES_CONFIG.fields)
    );

    // Transform pagination data
    const { prev, next } = transformPaginationData(
      metadata.page,
      metadata.limit,
      metadata.total,
      sortby
    );

    // Return component with transformed data
    return (
      <BlogEntriesView
        blogEntries={transformedBlogs}
        sortby={sortby}
        next={next}
        prev={prev}
      />
    );
  } catch (error) {
    console.error("Blog entries loading failed:", error);
    return null;
  }
}
