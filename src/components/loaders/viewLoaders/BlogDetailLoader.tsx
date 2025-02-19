import BlogDetail from "@/components/views/BlogDetail";
import { blogServer } from "@/lib/api/public/blog/server";

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
      ? await blogServer.fetchBlogCommentsAuthor(slug)
      : await blogServer.fetchBlog(slug);
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
