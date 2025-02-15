import { fetchBlogComments, fetchBlogDetail } from "@/lib/api/public/blogApi";
import BlogDetail from "../../views/BlogDetail";

interface BlogDetailLoaderProps {
  slug: string;
}

export async function BlogDetailLoader({ slug }: BlogDetailLoaderProps) {
  console.log("slug in BlogDetailLoader", slug);
  const blog = await fetchBlogDetail(slug);
  // const blog = await fetchBlogComments(slug);
  console.log("blog in BlogDetailLoader", blog);
  // TODO: transformations

  return <BlogDetail {...blog} />;
}
