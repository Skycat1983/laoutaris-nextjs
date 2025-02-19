import BlogDetail from "@/components/views/BlogDetail";
import { fetchBlogWithCommentAuthor } from "@/lib/api/experimental/serverBlogFetchers";
import { blogServer } from "@/lib/api/public/blog/server";
import {
  fetchBlog,
  // fetchBlogWithCommentAuthor,
} from "@/lib/api/public/blogApi";

interface Props {
  slug: string;
  showComments?: boolean;
}

export const BlogDetailLoader = async ({
  slug,
  showComments = false,
}: Props) => {
  try {
    const result = showComments
      ? await blogServer.fetchWithCommentAuthor(slug)
      : await fetchBlog(slug);

    if (!result.success) {
      if (showComments) {
        // if we couldn't fetch comments, fallback to basic blog
        const fallbackResult = await fetchBlog(slug);
        if (fallbackResult.success) {
          return <BlogDetail {...fallbackResult.data} showComments={false} />;
        }
      }
      throw new Error(result.error);
    }

    return <BlogDetail {...result.data} showComments={showComments} />;
  } catch (error) {
    throw error; // to error boundary
  }
};
