import { BlogDetail } from "@/components/views/BlogDetail";
import { ApiResponse } from "@/lib/data/types/apiTypes";
import {
  BlogEntryFrontendWithAuthor,
  BlogEntryPopulatedCommentsPopulatedFrontend,
} from "@/lib/data/types/blogTypes";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";

interface Props {
  slug: string;
  showComments?: boolean;
}

export type BlogDetailLoaderResult =
  | ApiResponse<BlogEntryPopulatedCommentsPopulatedFrontend>
  | ApiResponse<BlogEntryFrontendWithAuthor>;

const fetchBlogDetail = async ({
  slug,
  showComments,
}: Required<Props>): Promise<BlogDetailLoaderResult> => {
  const data = showComments
    ? await getBlogBySlugWithComments(slug)
    : await getBlogBySlugWithAuthor(slug);

  if (!data) {
    return {
      success: false,
      error: "Blog entry not found",
    };
  }

  return {
    success: true,
    data,
  };
};

export async function BlogDetailLoader({ slug, showComments = false }: Props) {
  try {
    const result = await fetchBlogDetail({ slug, showComments });

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data } = result;

    if (showComments) {
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
  } catch (error) {
    console.error("Error in BlogDetailLoader:", error);
    throw error;
  }
}
