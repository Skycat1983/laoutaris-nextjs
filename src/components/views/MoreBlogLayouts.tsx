"use client";

import { BlogEntryData } from "../loaders/viewLoaders/BlogListLoader";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

interface BlogLayoutProps {
  blogEntries: BlogEntryData[];
  next: string | null;
  prev: string | null;
}

// 1. Modern Card Grid
export const ModernCardGrid = ({ blogEntries }: BlogLayoutProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {blogEntries.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug} className="group">
            <article className="h-[200px] bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl flex">
              <div className="aspect-[16/9] relative  w-48">
                <Image
                  src={blog.imageUrl.replace(
                    "/upload/",
                    "/upload/w_800,q_auto/"
                  )}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  March 2024
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-emerald-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600 line-clamp-2">{blog.subtitle}</p>
                <div className="mt-4 flex items-center text-emerald-600">
                  <span className="text-sm font-medium">Read article</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const MagazineSpotlight = ({ blogEntries }: BlogLayoutProps) => {
  const firstSevenEntries = blogEntries.slice(0, 7);
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Featured Section */}
        <div className="lg:col-span-2">
          <Link href={`/blog/${blogEntries[0]?.slug}`} className="group block">
            <article className="relative rounded-3xl overflow-hidden">
              <Image
                src={blogEntries[0]?.imageUrl.replace(
                  "/upload/",
                  "/upload/w_1200,q_auto/"
                )}
                alt={blogEntries[0]?.title || ""}
                width={1200}
                height={600}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="text-emerald-400 mb-4">
                  May 2024 • Editor&apos;s Pick
                </div>
                <h1 className="text-4xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {blogEntries[0]?.title}
                </h1>
                <p className="text-white/80 text-xl">
                  {blogEntries[0]?.subtitle}
                </p>
              </div>
            </article>
          </Link>
        </div>

        {/* Secondary Articles */}
        {firstSevenEntries.slice(1).map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug} className="group">
            <article className="flex flex-col gap-4">
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden">
                <Image
                  src={blog.imageUrl.replace(
                    "/upload/",
                    "/upload/w_800,q_auto/"
                  )}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <div className="text-emerald-600 text-sm mb-2">June 2024</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600">{blog.subtitle}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const MagazineSpotlight2 = ({ blogEntries }: BlogLayoutProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-34 gap-12">
        {/* Featured Section */}
        <div className="lg:col-span-2">
          <Link href={`/blog/${blogEntries[0]?.slug}`} className="group block">
            <article className="relative rounded-3xl overflow-hidden">
              <Image
                src={blogEntries[0]?.imageUrl.replace(
                  "/upload/",
                  "/upload/w_1200,q_auto/"
                )}
                alt={blogEntries[0]?.title || ""}
                width={1200}
                height={600}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="text-emerald-400 mb-4">
                  May 2024 • Editor&apos;s Pick
                </div>
                <h1 className="text-4xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {blogEntries[0]?.title}
                </h1>
                <p className="text-white/80 text-xl">
                  {blogEntries[0]?.subtitle}
                </p>
              </div>
            </article>
          </Link>
        </div>

        {/* Secondary Articles */}
        {blogEntries.slice(1).map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug} className="group">
            <article className="flex flex-col gap-4">
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden">
                <Image
                  src={blog.imageUrl.replace(
                    "/upload/",
                    "/upload/w_800,q_auto/"
                  )}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <div className="text-emerald-600 text-sm mb-2">June 2024</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600">{blog.subtitle}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 5. Horizontal Scroll Cards with Categories
export const CategoryCards = ({ blogEntries }: BlogLayoutProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
        >
          {blogEntries.map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog.slug}
              className="flex-none w-[300px] snap-start group"
            >
              <article className="bg-white rounded-xl overflow-hidden shadow-lg h-full">
                <div className="aspect-[3/2] relative">
                  <Image
                    src={blog.imageUrl.replace(
                      "/upload/",
                      "/upload/w_600,q_auto/"
                    )}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                    Project
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">August 2024</div>
                  <h2 className="font-bold mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {blog.subtitle}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
