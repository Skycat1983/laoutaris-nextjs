"use server";

import { BlogSection } from "@/components/sections/BlogSection";
import { HomeSectionFallback } from "@/components/sections/HomeSectionFallback";
import { getBlogList } from "@/lib/data/services/getBlogList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "BlogSectionLoader",
  operation: "public.blog_section.loader",
  surface: "server_loader",
});

const BLOG_FETCH_CONFIG = {
  sortby: "latest" as const,
  limit: 4,
  // fields: ["title", "subtitle", "slug", "imageUrl"] as const,
} as const;

const blogFallbackConfig = {
  heading: "Blog:",
  subheading: "Recent posts",
  buttonLabel: "See more",
  buttonLink: "/blog",
} as const;

const renderBlogUnavailableFallback = () => (
  <HomeSectionFallback
    {...blogFallbackConfig}
    title="Recent posts are temporarily unavailable"
    message="This section could not be loaded right now. The blog archive remains available from the blog page."
    testId="blog-section-unavailable"
  />
);

const renderBlogEmptyFallback = () => (
  <HomeSectionFallback
    {...blogFallbackConfig}
    title="No recent posts are available yet"
    message="Blog posts will appear here once they are published."
    testId="blog-section-empty"
  />
);

export async function BlogSectionLoader() {
  try {
    const result = await getBlogList({
      sortby: BLOG_FETCH_CONFIG.sortby,
      limit: BLOG_FETCH_CONFIG.limit,
      // fields: BLOG_FETCH_CONFIG.fields,
    });

    if (!result) {
      throw new Error("No blog posts found");
    }

    if (result.data.length === 0) {
      return renderBlogEmptyFallback();
    }

    return <BlogSection blogs={result.data} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.blog_section.failed", { error });
    return renderBlogUnavailableFallback();
  }
}

// const blogCards = blogs.map((blog) =>
//   transformToPick(blog, BLOG_FETCH_CONFIG.fields)
// );

// export type BlogCardData = Pick<
//   FrontendBlogEntry,
//   (typeof BLOG_FETCH_CONFIG.fields)[number]
// >;
