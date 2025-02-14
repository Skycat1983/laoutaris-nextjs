import { fetchBlogDetail } from "@/lib/api/blogApi";
import BlogDetail from "../../views/BlogDetail";

interface BlogDetailLoaderProps {
  slug: string;
}

export async function BlogDetailLoader({ slug }: BlogDetailLoaderProps) {
  console.log("slug in BlogDetailLoader", slug);
  const blog = await fetchBlogDetail(slug);
  console.log("blog in BlogDetailLoader", blog);
  // TODO: transformations

  return <BlogDetail {...blog} />;
}
