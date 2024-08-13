import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import BlogCard from "@/components/cards/blogCard/BlogCard";
import dbConnect from "@/utils/mongodb";
import { getPopularBlogEntries } from "@/utils/server/getBlogEntries";

export default async function PopularBlogs() {
  await dbConnect();
  const popularEntries = await getPopularBlogEntries();

  const dateToYear = (date: Date) => {
    return new Date(date).getFullYear();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container ">
      <div className="text-left flex w-full">
        <h1 className="text-4xl">
          {dateToYear(popularEntries[0].displayDate)}
        </h1>
      </div>
      <HorizontalDivider />
      {popularEntries.flatMap((item, index) => [
        <BlogCard key={index} blogEntry={item} stem="latest" />,
        index < popularEntries.length - 1 && (
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
