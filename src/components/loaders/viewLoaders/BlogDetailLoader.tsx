import { BlogDetail } from "@/components/views/BlogDetail";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import {
  ApiResponse,
  PublicBlogEntry,
  PublicBlogEntryPopulated,
} from "@/lib/data/types";
import { delay } from "@/lib/utils/debug";
interface Props {
  slug: string;
  showComments?: boolean;
}

export type BlogDetailLoaderResult =
  | ApiResponse<PublicBlogEntryPopulated>
  | ApiResponse<PublicBlogEntry>;

export async function BlogDetailLoader({ slug, showComments = false }: Props) {
  await delay(2000);
  try {
    const result: BlogDetailLoaderResult = showComments
      ? await serverPublicApi.blog.singlePopulated(slug)
      : await serverPublicApi.blog.single(slug);
    console.log("result", result);

    if (!result.success) {
      const errorMessage =
        typeof result.error === "object"
          ? JSON.stringify(result.error)
          : result.error;

      throw new Error(errorMessage);
    }

    return <BlogDetail {...result.data} showComments={showComments} />;
  } catch (error) {
    console.error("Error in BlogDetailLoader:", error);
    throw error;
  }
}
