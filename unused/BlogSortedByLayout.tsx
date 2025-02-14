import React from "react";
import dbConnect from "@/lib/db/mongodb";
import { fetchBlogAvailability } from "@/lib/old_code/blog/data-fetching/fetchBlogAvailability";
import BlogSidebar from "../src/components/modules/sidebar/BlogSidebar";

type Props = {
  children: React.ReactNode;
};

//! UNUSED

const BlogSortByLayout = async ({ children }: Props) => {
  await dbConnect();

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1 lg:col-span-2"></div>

        <div className="col-span-8 lg:col-span-6 flex flex-col gap-24 ">
          {children}
        </div>
        <div className="col-span-2 lg:col-span-2 flex flex-col gap-24 ">
          {/* <BlogSidebar options={sortRangeOptions} /> */}
        </div>
        <div className="col-span-1 lg:col-span-2"></div>
      </div>
    </>
  );
};

export default BlogSortByLayout;
