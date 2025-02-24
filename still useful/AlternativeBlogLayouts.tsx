"use client";

import { BlogEntryData } from "../src/components/loaders/viewLoaders/BlogListLoader";
import Image from "next/image";
import Link from "next/link";
// import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FrontendBlogEntry } from "@/lib/data/types";

// Shared Types
interface BlogLayoutProps {
  blogEntries: BlogEntryData[];
  next: string | null;
  prev: string | null;
}

// 4. Horizontal Scroll Layout
export const HorizontalScrollLayout = ({ blogEntries }: BlogLayoutProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar"
      >
        {blogEntries.map((blog) => (
          <Link
            href={`/blog/${blog.slug}`}
            key={blog.slug}
            className="flex-none w-[300px] group"
          >
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src={blog.imageUrl.replace("/upload/", "/upload/w_400,q_auto/")}
                alt={blog.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-4 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <h2 className="text-white text-xl font-bold">{blog.title}</h2>
                <p className="text-white/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {blog.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 5. Featured + List Layout
export const FeaturedListLayout = ({ blogEntries }: BlogLayoutProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = blogEntries[featuredIndex];
  const otherEntries = blogEntries.filter((_, i) => i !== featuredIndex);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Link href={`/blog/${featured.slug}`} className="group block">
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={featured.imageUrl.replace(
                  "/upload/",
                  "/upload/w_1200,q_auto/"
                )}
                alt={featured.title}
                width={1200}
                height={600}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-8 flex flex-col justify-end">
                <span className="text-emerald-400 mb-2">
                  {/* {featured.displayDate.toLocaleDateString()} */}
                </span>
                <h1 className="text-white text-4xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                  {featured.title}
                </h1>
                <p className="text-white/80 text-lg">{featured.subtitle}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {otherEntries.slice(0, 4).map((blog) => (
              <Link
                href={`/blog/${blog.slug}`}
                key={blog.slug}
                className="group block"
                onMouseEnter={() => setFeaturedIndex(blogEntries.indexOf(blog))}
              >
                <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <Image
                    src={blog.imageUrl.replace(
                      "/upload/",
                      "/upload/w_200,q_auto/"
                    )}
                    alt={blog.title}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <span className="text-emerald-600 text-sm">
                      {/* {blog.displayDate.toLocaleDateString()} */}
                    </span>
                    <h3 className="font-bold group-hover:text-emerald-600 transition-colors">
                      {blog.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add new Carousel Layout
export const CarouselLayout = ({ blogEntries }: BlogLayoutProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((current) =>
      current === blogEntries.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? blogEntries.length - 1 : current - 1
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="relative h-[600px] rounded-xl overflow-hidden">
        {blogEntries.map((blog, index) => (
          <div
            key={blog.slug}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === activeIndex
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Link href={`/blog/${blog.slug}`} className="block h-full">
              <div className="relative h-full">
                <Image
                  src={blog.imageUrl.replace(
                    "/upload/",
                    "/upload/w_1200,q_auto/"
                  )}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="text-emerald-400 text-sm">
                      {formatDate(blog.displayDate)}
                    </span>
                    <h2 className="text-white text-4xl font-bold mt-2">
                      {blog.title}
                    </h2>
                    <p className="text-white/80 text-xl mt-4">
                      {blog.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {blogEntries.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
