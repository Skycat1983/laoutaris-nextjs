"use client";

import { BlogEntryData } from "../src/components/loaders/viewLoaders/BlogListLoader";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock, Calendar } from "lucide-react";

interface BlogLayoutProps {
  blogEntries: BlogEntryData[];
}

// 1. Split Screen Layout
export const SplitScreenFeatured = ({ blogEntries }: BlogLayoutProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(5);
  const featured = blogEntries[featuredIndex];
  const otherEntries = blogEntries.filter((_, i) => i !== featuredIndex);

  const firstFourEntries = otherEntries.slice(0, 4);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[800px]">
        {/* Featured Article - Left Side */}
        <div className="sticky top-4 h-[calc(66vh-2rem)]">
          <Link href={`/blog/${featured.slug}`} className="group block h-full">
            <div className="relative h-full rounded-2xl overflow-hidden">
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
        <div className="space-y-6">
          {firstFourEntries.map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog.slug}
              className="group block"
              onMouseEnter={() => setFeaturedIndex(blogEntries.indexOf(blog))}
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
  );
};

// 2. Magazine Style Layout
export const MagazineFeatured = ({ blogEntries }: BlogLayoutProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = blogEntries[featuredIndex];
  const otherEntries = blogEntries.filter((_, i) => i !== featuredIndex);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Featured Article - Full Width */}
        <div className="lg:col-span-4">
          <Link href={`/blog/${featured.slug}`} className="group block">
            <article className="relative h-[630px] rounded-2xl overflow-hidden">
              <Image
                src={featured.imageUrl.replace(
                  "/upload/",
                  "/upload/w_1600,q_auto/"
                )}
                alt={featured.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-2xl">
                  <span className="text-emerald-400">Featured Story</span>
                  <h1 className="text-5xl font-bold text-white mt-2 group-hover:text-emerald-400 transition-colors">
                    {featured.title}
                  </h1>
                  <p className="text-white/80 text-xl mt-4">
                    {featured.subtitle}
                  </p>
                </div>
              </div>
            </article>
          </Link>
        </div>

        {/* Secondary Articles - Grid */}
        {otherEntries.slice(0, 4).map((blog) => (
          <Link
            href={`/blog/${blog.slug}`}
            key={blog.slug}
            className="group"
            onMouseEnter={() => setFeaturedIndex(blogEntries.indexOf(blog))}
          >
            <article className="space-y-4">
              <div className="aspect-[5/3] relative rounded-xl overflow-hidden">
                <Image
                  src={blog.imageUrl.replace(
                    "/upload/",
                    "/upload/w_600,q_auto/"
                  )}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <span className="text-sm text-emerald-600">March 2024</span>
                <h2 className="text-xl font-bold mt-2 group-hover:text-emerald-600 transition-colors">
                  {blog.title}
                </h2>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 3. Stacked Cards Layout
export const SemiFeatured = ({ blogEntries }: BlogLayoutProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = blogEntries[featuredIndex];
  const otherEntries = blogEntries.filter((_, i) => i !== featuredIndex);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Featured Article */}
        <div className="lg:w-2/3">
          <Link href={`/blog/${featured.slug}`} className="group block">
            <article className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-[16/9] relative">
                <Image
                  src={featured.imageUrl.replace(
                    "/upload/",
                    "/upload/w_1200,q_auto/"
                  )}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-emerald-600">March 2024</span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />5 min read
                  </span>
                </div>
                <h1 className="text-3xl font-bold group-hover:text-emerald-600 transition-colors">
                  {featured.title}
                </h1>
                <p className="text-gray-600 text-lg mt-4">
                  {featured.subtitle}
                </p>
                <div className="mt-6 inline-flex items-center text-emerald-600 font-medium">
                  Read more <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </article>
          </Link>
        </div>

        {/* List */}
        {/* <div className="lg:w-1/3 space-y-6">
          {otherEntries.slice(0, 5).map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog.slug}
              className="group block"
              onMouseEnter={() => setFeaturedIndex(blogEntries.indexOf(blog))}
            >
              <article className="bg-white rounded-xl p-4 transition-all hover:shadow-md">
                <h2 className="font-bold group-hover:text-emerald-600 transition-colors mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {blog.subtitle}
                </p>
                <div className="mt-4 text-sm text-emerald-600">March 2024</div>
              </article>
            </Link>
          ))}
        </div> */}
      </div>
    </div>
  );
};

// 4. Minimal Grid Layout
export const FeaturedBlog = ({ blogEntries }: BlogLayoutProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(2);
  const featured = blogEntries[featuredIndex];
  const otherEntries = blogEntries.filter((_, i) => i !== featuredIndex);

  const colour = "emerald";

  return (
    <div className="container mx-auto p-4">
      {/* Featured Article */}
      <Link href={`/blog/${featured.slug}`} className="group block mb-12">
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image
              src={featured.imageUrl.replace(
                "/upload/",
                "/upload/w_1200,q_auto/"
              )}
              alt={featured.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className={`text-${colour}-600 text-sm`}>
              Featured Post • March 2024
            </span>
            <h1 className="text-4xl font-bold group-hover:text-emerald-600 transition-colors">
              {featured.title}
            </h1>
            <p className="text-gray-600 text-lg">{featured.subtitle}</p>
            <div className={`inline-flex items-center text-${colour}-600`}>
              Continue reading <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};
