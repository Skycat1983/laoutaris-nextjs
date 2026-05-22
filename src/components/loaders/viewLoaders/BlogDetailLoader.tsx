import { BlogDetail } from "@/components/views/BlogDetail";
import type { ApiResponse } from "@/lib/data/types/apiTypes";
import type {
  BlogEntryFrontendWithAuthor,
  BlogEntryPopulatedCommentsPopulatedFrontend,
} from "@/lib/data/types/blogTypes";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";
import { notFound } from "next/navigation";

interface Props {
  slug: string;
  showComments?: boolean;
}

export type BlogDetailLoaderResult =
  | ApiResponse<BlogEntryPopulatedCommentsPopulatedFrontend>
  | ApiResponse<BlogEntryFrontendWithAuthor>;

const logger = createServerLogger({
  component: "BlogDetailLoader",
  operation: "public.blog.detail_loader",
  surface: "server_loader",
});

const fetchBlogDetail = async ({
  slug,
  showComments,
}: Required<Props>): Promise<BlogDetailLoaderResult> => {
  const primaryBlog = await getBlogBySlugWithAuthor(slug);

  if (!primaryBlog) {
    return {
      success: false,
      error: "Blog entry not found",
    };
  }

  if (!showComments) {
    return {
      success: true,
      data: primaryBlog,
    };
  }

  try {
    const data = await getBlogBySlugWithComments(slug);

    if (!data) {
      logger.error("loader.public.blog_detail.comments.failed", {
        slug,
        reason: "Blog comments unavailable",
      });
      return {
        success: true,
        data: primaryBlog,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.public.blog_detail.comments.failed", {
      error,
      slug,
    });
  }

  return {
    success: true,
    data: primaryBlog,
  };
};

export async function BlogDetailLoader({ slug, showComments = false }: Props) {
  let result: BlogDetailLoaderResult;

  try {
    result = await fetchBlogDetail({ slug, showComments });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.public.blog_detail.failed", {
      error,
      slug,
      showComments,
    });
    throw error;
  }

  if (!result.success) {
    notFound();
  }

  const { data } = result;

  if (showComments && "comments" in data) {
    return (
      <BlogDetail
        blog={data as BlogEntryPopulatedCommentsPopulatedFrontend}
        showComments={true}
      />
    );
  } else {
    return (
      <BlogDetail
        blog={data as BlogEntryFrontendWithAuthor}
        showComments={false}
      />
    );
  }
}
