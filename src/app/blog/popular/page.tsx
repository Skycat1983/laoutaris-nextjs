import dbConnect from "@/utils/mongodb";
import { fetchBlogSection } from "@/lib/server/blog/data-fetching/fetchBlogSection";
import BlogSectionView from "@/views/BlogSectionView";

export default async function PopularBlogs() {
  await dbConnect();
  const stem = "popular";
  const result = await fetchBlogSection(stem);

  const blogEntries = result.success ? result.data : null;
  console.log("blogEntries in featured page", blogEntries);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container ">
      {blogEntries && <BlogSectionView blogEntries={blogEntries} />}
    </main>
  );
}
