import BlogDetail from "@/components/views/BlogDetail";
import { serverApi } from "@/lib/api/server";
interface Props {
  slug: string;
  showComments?: boolean;
}

export default async function BlogDetailLoader({
  slug,
  showComments = false,
}: Props) {
  try {
    const result = showComments
      ? await serverApi.blog.fetchBlogCommentsAuthor(slug)
      : await serverApi.blog.fetchBlog(slug);
    console.log("result", result);

    if (!result.success) {
      // Convert error to string if it's an object
      const errorMessage =
        typeof result.error === "object"
          ? JSON.stringify(result.error)
          : result.error;

      throw new Error(errorMessage);
    }

    return <BlogDetail {...result.data} showComments={showComments} />;
  } catch (error) {
    console.error("Error in BlogDetailLoader:", error);
    throw error; // or handle error appropriately
  }
}
