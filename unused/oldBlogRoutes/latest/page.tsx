import dbConnect from "@/utils/mongodb";
import { fetchBlogSection } from "@/lib/server/blog/data-fetching/fetchBlogSection";
import BlogSectionView from "@/views/BlogSectionView";

export default async function LatestBlogs() {
  await dbConnect();
  const stem = "latest";
  const result = await fetchBlogSection(stem);

  const blogEntries = result.success ? result.data : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container ">
      {blogEntries && <BlogSectionView blogEntries={blogEntries} />}
    </main>
  );
}
