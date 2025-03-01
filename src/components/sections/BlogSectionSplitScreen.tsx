"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BlogEntryData } from "../loaders/viewLoaders/BlogListLoader";
import { Calendar, ChevronRight } from "lucide-react";

interface BlogLayoutProps {
  blogEntries: BlogEntryData[];
  // next: string | null;
  // prev: string | null;
}

// TODO: This probably doesn't need state anymore?
//? state left in for now in case i restore/fix the hover effect thing
export const BlogSectionSplitScreen = ({ blogEntries }: BlogLayoutProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = blogEntries[featuredIndex];
  const otherEntries = blogEntries.filter((_, i) => i !== featuredIndex);
  const firstFourEntries = otherEntries.slice(0, 4);

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Article - Left Side */}
          <div className="relative lg:sticky lg:top-4 h-[calc(69vh-2rem)] mb-8 lg:mb-0">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block h-full"
            >
              <div className="relative h-full rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={featured.imageUrl.replace(
                    "/upload/",
                    "/upload/w_1200,q_auto/"
                  )}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="absolute bottom-0 p-8">
                    <span className="text-emerald-400 text-sm">March 2024</span>
                    <h1 className="text-4xl font-bold text-white mt-2 group-hover:text-emerald-400 transition-colors">
                      {featured.title}
                    </h1>
                    <p className="text-white/80 text-xl mt-4">
                      {featured.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* List - Right Side */}
          <div className="relative z-10 space-y-6 bg-white/80 backdrop-blur-sm rounded-xl p-4">
            {firstFourEntries.map((blog) => (
              <Link
                href={`/blog/${blog.slug}`}
                key={blog.slug}
                className="group block"
              >
                <article className="bg-white rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 relative flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={blog.imageUrl.replace(
                          "/upload/",
                          "/upload/w_200,q_auto/"
                        )}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 text-sm text-emerald-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>March 2024</span>
                      </div>
                      <h2 className="font-bold text-xl group-hover:text-emerald-600 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {blog.subtitle}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-row w-full justify-end px-8 pt-4">
          <Link href={`/blog/?sortby=latest`}>
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-xl font-bold underline">VIEW ALL</h1>

              <ChevronRight className="w-8 h-8" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
