import { fetchBlogComments, fetchBlogDetail } from "@/lib/api/public/blogApi";
import BlogDetail from "../../views/BlogDetail";

interface BlogDetailLoaderProps {
  slug: string;
}

export async function BlogDetailLoader({ slug }: BlogDetailLoaderProps) {
  const blog = await fetchBlogDetail(slug);
  if (!blog) {
    throw new Error("Blog not found");
  }

  return <BlogDetail {...blog} />;
}
