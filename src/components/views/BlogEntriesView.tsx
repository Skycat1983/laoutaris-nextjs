"use server";

import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import React from "react";
import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";
import Link from "next/link";
import Image from "next/image";

type BlogPageLink = string | null;

type BlogSectionProps = {
  blogEntries: FrontendBlogEntryUnpopulated[];
  sortby: string;
  next: BlogPageLink;
  prev: BlogPageLink;
};

const BlogEntriesView = ({
  blogEntries,
  sortby,
  next,
  prev,
}: BlogSectionProps) => {
  const dateToYear = (date: Date) => {
    return new Date(date).getFullYear();
  };

  const getYearColor = (year: number) => {
    switch (year) {
      case 2014:
        return "bg-orange-400";
      case 2015:
        return "bg-indigo-500";
      case 2016:
        return "bg-green-700";
      case 2017:
        return "bg-yellow-500";
      // case 2018:
      //   return "bg-green-500";
      // case 2019:
      //   return "bg-coral-500";
      // case 2020:
      //   return "bg-pink-500";
      case 2021:
        return "bg-purple-500";
      case 2022:
        return "bg-blue-400";
      case 2023:
        return "bg-black";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <>
      <div className={`grid grid-cols-12 gap-4 py-6`}>
        <div className="col-span-1 xl:col-span-2"></div>

        <div className="col-span-10 xl:col-span-8 flex flex-col gap-24">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 m-5">
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
                      <p
                        className={`text-white/80 text-sm p-1 w-min rounded ${getYearColor(
                          dateToYear(blog.displayDate)
                        )}`}
                      >
                        {dateToYear(blog.displayDate)}
                      </p>
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
        <div className="col-span-1 xl:col-span-2"></div>
      </div>
      <div className="flex justify-center mt-4">
        {prev && (
          <Link href={prev} className="px-4 py-2 bg-gray-200 rounded">
            Previous
          </Link>
        )}

        {next && (
          <Link href={next} className="px-4 py-2 bg-gray-200 rounded">
            Next
          </Link>
        )}
      </div>
    </>
  );
};

export default BlogEntriesView;
