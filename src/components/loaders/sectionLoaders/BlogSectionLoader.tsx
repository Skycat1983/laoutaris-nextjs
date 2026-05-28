import { BlogPrototypeSection } from "@/components/prototypes/home/BlogPrototypeSection";
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
  limit: 5,
  // fields: ["title", "subtitle", "slug", "imageUrl"] as const,
} as const;

const renderBlogFallback = () => (
  <BlogPrototypeSection blogs={[]} useAlternateBackground={false} />
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
      return renderBlogFallback();
    }

    return (
      <BlogPrototypeSection
        blogs={result.data}
        useAlternateBackground={false}
      />
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.blog_section.failed", { error });
    return renderBlogFallback();
  }
}

// const blogCards = blogs.map((blog) =>
//   transformToPick(blog, BLOG_FETCH_CONFIG.fields)
// );

// export type BlogCardData = Pick<
//   FrontendBlogEntry,
//   (typeof BLOG_FETCH_CONFIG.fields)[number]
// >;
