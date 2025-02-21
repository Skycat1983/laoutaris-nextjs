"use client";

import {
  BlogFeedCard,
  BlogFeedCardSkeleton,
} from "../../modules/cards/BlogFeedCard";
import { fetchBlogFeed } from "@/lib/api/admin/feedApi";
import { Feed, FeedSkeleton } from "@/components/compositions/Feed";
import { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { SkeletonFactory } from "@/components/compositions/SkeletonFactory";
import { Suspense } from "react";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useEffect, useState } from "react";

//! old code
// export function BlogFeedSkeleton() {
//   return (
//     <SkeletonFactory
//       Layout={FeedSkeleton}
//       Card={BlogFeedCardSkeleton}
//       count={3}
//     />
//   );
// }

// export function BlogFeed({ page = 1 }: { page?: number }) {
//   return (
//     <Feed<FrontendBlogEntry>
//       // fetchFn={(params) => fetchBlogFeed({ ...params, page })}
//       fetchFn={(params) => clientAdminApi.read.readBlogs({ ...params, page })}
//       CardComponent={BlogFeedCard}
//       title="Blog Feed"
//     />
//   );
// }

export function BlogFeed() {
  const [blogs, setBlogs] = useState<FrontendBlogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const result = await clientAdminApi.read.readBlogs({
          page: 1,
          limit: 10,
        });
        if (result.success) {
          setBlogs(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4 p-4">
      {blogs.map((blog, index) => (
        <BlogFeedCard key={blog._id || index} item={blog} />
      ))}
    </div>
  );
}
