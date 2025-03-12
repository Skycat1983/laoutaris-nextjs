"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "../shadcn/skeleton";
import { SkeletonFactory } from "@/components/compositions/SkeletonFactory";
import { BlogEntryFrontend } from "@/lib/data/types/blogTypes";

interface BlogLayoutProps {
  blogEntries: BlogEntryFrontend[];
  // next: string | null;
  // prev: string | null;
}

export const BlogsSectionFeatured = ({ blogEntries }: BlogLayoutProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = blogEntries[featuredIndex];
  const otherEntries = blogEntries.filter((_, i) => i !== featuredIndex);

  return (
    <>
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
                {/* <div className="absolute bottom-0 right-0 p-0">
                <NewLogoLight />
              </div> */}
              </article>
            </Link>
          </div>

          {/* Secondary Articles - Grid */}
          {otherEntries.slice(0, 4).map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog.slug}
              className="group"
              // onMouseEnter={() => setFeaturedIndex(blogEntries.indexOf(blog))}
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
                  <span className="text-sm text-emerald-600">Featured</span>
                  <h2 className="text-xl font-bold mt-2 group-hover:text-emerald-600 transition-colors">
                    {blog.title}
                  </h2>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-row w-full justify-end px-8 pt-4">
          <Link href={`/blog/?sortby=featured`}>
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

// Direct Skeleton Approach
export const BlogsSectionFeaturedSkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Featured Article Skeleton */}
        <div className="lg:col-span-4">
          <div className="relative h-[630px] rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Skeleton className="w-24 h-4 mb-2" />
              <Skeleton className="w-2/3 h-12 mb-4" />
              <Skeleton className="w-1/2 h-6" />
            </div>
          </div>
        </div>

        {/* Secondary Articles Skeletons */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-[5/3] w-full rounded-xl" />
            <div>
              <Skeleton className="w-16 h-4 mb-2" />
              <Skeleton className="w-3/4 h-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// SkeletonFactory Approach
const BlogCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[5/3] w-full rounded-xl" />
    <div>
      <Skeleton className="w-16 h-4 mb-2" />
      <Skeleton className="w-3/4 h-6" />
    </div>
  </div>
);

const BlogLayoutSkeleton = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-4">
        <div className="relative h-[630px] rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-full" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Skeleton className="w-24 h-4 mb-2" />
            <Skeleton className="w-2/3 h-12 mb-4" />
            <Skeleton className="w-1/2 h-6" />
          </div>
        </div>
      </div>
      {children}
    </div>
  </div>
);

export const BlogsSectionFeaturedSkeletonFactory = () => (
  <SkeletonFactory
    Layout={BlogLayoutSkeleton}
    Card={BlogCardSkeleton}
    count={4}
  />
);
