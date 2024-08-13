import dbConnect from "@/utils/mongodb";
import { getBlogEntry } from "@/utils/server/getBlogEntry";
import BlogItem from "@/views/BlogItem";

export default async function BlogEntry({
  params,
}: {
  params: { blogSlug: string };
}) {
  await dbConnect();
  const blogEntry = await getBlogEntry(params.blogSlug);
  console.log("blogEntry", blogEntry);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container ">
      {blogEntry && <BlogItem {...blogEntry} />}
    </main>
  );
}
