"use client";

import { BlogFeedCard } from "@/components/modules/cards/BlogFeedCard";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { useEffect, useState } from "react";
import { FeedPagination } from "@/components/elements/pagination/FeedPagination";
import type { PaginationMetadata } from "@/components/elements/pagination/FeedPagination";
import { clientApi } from "@/lib/api/clientApi";

export function BlogFeed() {
  const [blogs, setBlogs] = useState<FrontendBlogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  async function fetchBlogs(page: number) {
    setIsLoading(true);
    try {
      const result = await clientApi.admin.read.blogs({
        page,
        limit: 10,
      });

      if (result.success) {
        setBlogs(result.data);
        if (result.metadata) {
          setMetadata({
            page: result.metadata.page ?? 1,
            limit: result.metadata.limit ?? 10,
            total: result.metadata.total ?? 0,
            totalPages: result.metadata.totalPages ?? 1,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchBlogs(newPage);
  };

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        {blogs.map((blog, index) => (
          <BlogFeedCard key={blog._id || index} item={blog} />
        ))}
      </div>
      <FeedPagination
        metadata={metadata}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
