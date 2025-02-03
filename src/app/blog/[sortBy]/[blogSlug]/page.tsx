import dbConnect from "@/utils/mongodb";
import BlogItem from "@/components/views/BlogItem";
import { fetchBlogEntry } from "@/lib/server/blog/data-fetching/fetchBlogEntry";

export default async function BlogEntry({
  params,
}: {
  params: { blogSlug: string };
}) {
  await dbConnect();
  const result = await fetchBlogEntry(params.blogSlug);
  const blogEntry = result.success ? result.data : null;
  console.log("blogEntry :>> ", blogEntry);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container mx-auto">
      {blogEntry && <BlogItem {...blogEntry} />}
    </main>
  );
}
