import dbConnect from "@/utils/mongodb";
import {
  getLatestBlogEntries,
  getOldestBlogEntries,
} from "@/utils/server/getBlogEntries";

export default async function OldestBlogs() {
  await dbConnect();
  const latestEntries = await getOldestBlogEntries();
  console.log("latestEntries", latestEntries);
  // const sectionItem = await getBiography(params.articleSlug);
  // console.log("sectionItem :>> ", sectionItem);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4">
      {/* {sectionItem && <Article article={sectionItem} />} */}
    </main>
  );
}
