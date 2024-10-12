import { BlogSection } from "@/lib/server/blog/blogTypes";
import { fetchBlogSection } from "@/lib/server/blog/data-fetching/fetchBlogSection";
import { delay } from "@/utils/debug";
import dbConnect from "@/utils/mongodb";
import BlogSectionView from "@/components/views/BlogSectionView";

export default async function BlogSection({
  params,
}: {
  params: { section: BlogSection };
}) {
  await dbConnect();
  await delay(2000);
  const result = await fetchBlogSection(params.section);
  const blogEntries = result.success ? result.data : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:px-12 py-4 container">
      {blogEntries && <BlogSectionView blogEntries={blogEntries} />}
    </main>
  );
}
