"use client";

import { useState, useEffect } from "react";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { BlogFilterDropdowns } from "./BlogFilterDropdowns";

type FilterKey = "featured" | "year" | null;

interface FilterState {
  key: FilterKey;
  value: string | null;
}

export function ReadBlogList() {
  const [blogs, setBlogs] = useState<FrontendBlogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    key: null,
    value: null,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await clientAdminApi.read.readBlogs({
          page: 1,
          limit: 10,
        });
        if (response.success) {
          let filteredBlogs = response.data;
          if (activeFilter.key && activeFilter.value) {
            filteredBlogs = response.data.filter((blog) => {
              const key = activeFilter.key;
              if (key === null) return true;

              if (key === "featured") {
                return blog.featured === (activeFilter.value === "true");
              }

              if (key === "year") {
                const blogYear = new Date(blog.displayDate)
                  .getFullYear()
                  .toString();
                return blogYear === activeFilter.value;
              }

              return true;
            });
          }
          setBlogs(filteredBlogs);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [activeFilter]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      console.log("Copied ID:", id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFilterChange = (key: FilterKey, value: string | null) => {
    setActiveFilter({ key, value });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <BlogFilterDropdowns onFilterChange={handleFilterChange} />
      {isLoading ? (
        <BlogListSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={blog.imageUrl.replace(
                    "/upload/",
                    "/upload/w_200,h_200,c_fill/"
                  )}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-medium truncate">{blog.title}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {new Date(blog.displayDate).toLocaleDateString()} -
                  {blog.featured ? " Featured" : " Not Featured"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopyId(blog._id)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="rounded-lg h-[200px] w-full" />
      ))}
    </div>
  );
}
