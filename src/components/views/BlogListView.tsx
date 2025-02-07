"use server";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NavigateNextIcon } from "../ui/common/icons/NavigateNextIcon";
import { Subnav } from "../ui/subnav/Subnav";
import { FrontendBlogEntry } from "@/lib/types/blogTypes";
import { BLOG_NAV_LINKS } from "@/constants/navigationLinks";
import { dateToYear } from "@/utils/dateUtils";
import { getYearColor } from "@/utils/colorUtils";

type BlogPageLink = string | null;

type BlogSectionProps = {
  blogEntries: FrontendBlogEntry[];
  sortby: string;
  next: BlogPageLink;
  prev: BlogPageLink;
};

const BlogListView = ({
  blogEntries,
  sortby,
  next,
  prev,
}: BlogSectionProps) => {
  return (
    <>
      <Subnav links={BLOG_NAV_LINKS} />

      <div className={`grid grid-cols-12 gap-4 py-0`}>
        <div className="col-span-1 xl:col-span-2"></div>

        <div className="col-span-10 xl:col-span-8 flex flex-col gap-24">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 m-5">
            {blogEntries.map((blog, index) => (
              <Link key={index} href={`/blog/${blog.slug}`}>
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
        <div className="flex flex-row w-[200px] justify-center items-center gap-5">
          {prev ? (
            <Link href={prev}>
              <div className="text-black rounded-full border border-1 border-black w-12 h-12 flex justify-center items-center hover:bg-gray-200">
                <NavigateNextIcon style={{ transform: "rotate(180deg)" }} />
              </div>
            </Link>
          ) : (
            <div className="bg-gray-300 text-gray-500 rounded-full border border-1 border-gray-500 w-12 h-12 flex justify-center items-center cursor-not-allowed">
              <NavigateNextIcon style={{ transform: "rotate(180deg)" }} />
            </div>
          )}

          {next ? (
            <Link href={next}>
              <div className="text-black rounded-full border border-1 border-black w-12 h-12 flex justify-center items-center hover:bg-gray-200">
                <NavigateNextIcon />
              </div>
            </Link>
          ) : (
            <div className="bg-gray-300 text-gray-500 rounded-full border border-1 border-gray-500 w-12 h-12 flex justify-center items-center cursor-not-allowed">
              <NavigateNextIcon />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogListView;
