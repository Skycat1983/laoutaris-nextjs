import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import BlogCard from "@/components/ui/cards/blogCard/BlogCard";
import React from "react";
import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";

type BlogSectionProps = {
  blogEntries: FrontendBlogEntryUnpopulated[];
};

const BlogEntriesView = ({ blogEntries }: BlogSectionProps) => {
  const dateToYear = (date: Date) => {
    return new Date(date).getFullYear();
  };
  return (
    <div>
      <div className="text-left flex w-full">
        <h1 className="text-4xl">{dateToYear(blogEntries[0].displayDate)}</h1>
      </div>
      <HorizontalDivider />
      {blogEntries.flatMap((item, index) => [
        <BlogCard key={index} blogEntry={item} stem="latest" />,
        index < blogEntries.length - 1 && (
          <HorizontalDivider key={`divider-${index}`} />
        ),
      ])}

      <div className="col-start-3 col-span-6 my-4 mx-4">
        <button className="w-full py-2 text-center text-sm font-semibold  bg-gray-200 rounded hover:bg-blue-200">
          Load more...
        </button>
      </div>
    </div>
  );
};

export default BlogEntriesView;
