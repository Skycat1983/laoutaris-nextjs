import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import BlogCard from "@/components/cards/blogCard/BlogCard";
import dbConnect from "@/utils/mongodb";
import { getOldestBlogEntries } from "@/utils/server/getBlogEntries";

export default async function OldestBlogs() {
  await dbConnect();
  const oldestEntries = await getOldestBlogEntries();

  const dateToYear = (date: Date) => {
    return new Date(date).getFullYear();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container ">
      {/* {sectionItem && <Article article={sectionItem} />} */}
      <div className="text-left flex w-full">
        <h1 className="text-4xl">{dateToYear(oldestEntries[0].displayDate)}</h1>
      </div>
      <HorizontalDivider />
      {oldestEntries.flatMap((item, index) => [
        <BlogCard key={index} blogEntry={item} />,
        index < oldestEntries.length - 1 && (
          <HorizontalDivider key={`divider-${index}`} />
        ),
      ])}

      <div className="col-start-3 col-span-6 my-4 mx-4">
        <button className="w-full py-2 text-center text-sm font-semibold  bg-gray-200 rounded hover:bg-blue-200">
          Load more...
        </button>
      </div>
    </main>
  );
}
