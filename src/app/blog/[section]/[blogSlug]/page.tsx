import dbConnect from "@/utils/mongodb";
import BlogItem from "@/views/BlogItem";
import { fetchBlogEntry } from "@/lib/server/blog/data-fetching/fetchBlogEntry";

export default async function BlogEntry({
  params,
}: {
  params: { blogSlug: string };
}) {
  await dbConnect();
  const result = await fetchBlogEntry(params.blogSlug);
  const blogEntry = result.success ? result.data : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container ">
      {blogEntry && <BlogItem {...blogEntry} />}
    </main>
  );
}
