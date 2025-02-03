import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import BlogCard from "@/components/ui/cards/blogCard/BlogCard";
import React from "react";
import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";
import ContentLayout from "../layouts/ContentLayout";
import Link from "next/link";
import Image from "next/image";

type BlogSectionProps = {
  blogEntries: FrontendBlogEntryUnpopulated[];
  sortby: string;
};

const BlogEntriesView = ({ blogEntries, sortby }: BlogSectionProps) => {
  const dateToYear = (date: Date) => {
    return new Date(date).getFullYear();
  };
  return (
    // <ContentLayout>
    <>
      <div className={`grid grid-cols-12 gap-4 py-6`}>
        <div className="col-span-1 lg:col-span-2"></div>

        <div className="col-span-10 lg:col-span-8 flex flex-col gap-24">
          <section className="grid grid-cols-3 gap-10 bg-red-100">
            {blogEntries.map((blog, index) => (
              <Link key={index} href={`/blog/${sortby}/${blog.slug}`}>
                <div className="relative group w-full">
                  <div className="relative">
                    <Image
                      src={blog.imageUrl.replace(
                        "/upload/",
                        "/upload/w_300,q_auto/"
                      )}
                      alt={blog.title}
                      width={200}
                      height={200}
                      className="w-full h-[300px] shadow-xl object-cover"
                      loading="lazy"
                    />
                    {/* Overlay with gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <h2 className="text-white text-2xl font-bold">
                        {blog.title}
                      </h2>
                      <p className="text-white/80 text-md">{blog.subtitle}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </div>
        <div className="col-span-1 lg:col-span-2"></div>
      </div>
    </>
  );
};

export default BlogEntriesView;

// <div className="bg-red-100">
//   <div className="text-left flex w-full">
//     <h1 className="text-4xl">{dateToYear(blogEntries[0].displayDate)}</h1>
//   </div>
//   <HorizontalDivider />
//   {blogEntries.flatMap((item, index) => [
//     <BlogCard key={index} blogEntry={item} stem="latest" />,
//     index < blogEntries.length - 1 && (
//       <HorizontalDivider key={`divider-${index}`} />
//     ),
//   ])}

//   <div className="col-start-3 col-span-6 my-4 mx-4">
//     <button className="w-full py-2 text-center text-sm font-semibold  bg-gray-200 rounded hover:bg-blue-200">
//       Load more...
//     </button>
//   </div>
// </div>
