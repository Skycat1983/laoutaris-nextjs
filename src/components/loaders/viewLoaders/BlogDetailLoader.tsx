import { BlogDetail } from "@/components/views/BlogDetail";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { ApiResponse } from "@/lib/data/types/apiTypes";
import {
  BlogEntryFrontend,
  BlogEntryFrontendWithAuthor,
  BlogEntryPopulatedCommentsPopulatedFrontend,
} from "@/lib/data/types/blogTypes";
import { delay } from "@/lib/utils/debugUtils";

interface Props {
  slug: string;
  showComments?: boolean;
}

export type BlogDetailLoaderResult =
  | ApiResponse<BlogEntryPopulatedCommentsPopulatedFrontend>
  | ApiResponse<BlogEntryFrontendWithAuthor>;

export async function BlogDetailLoader({ slug, showComments = false }: Props) {
  // await delay(2000);
  try {
    const result: BlogDetailLoaderResult = showComments
      ? await serverPublicApi.blog.singlePopulated(slug)
      : await serverPublicApi.blog.single(slug);
    console.log("result", result);

    if (!result.success) {
      throw new Error(result.error);
    }
    console.log("result in blog loader", result);
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
