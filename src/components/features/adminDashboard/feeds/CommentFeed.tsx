"use client";

import { useEffect, useState } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { CommentFrontendPopulated } from "@/lib/data/types";
import { FeedPagination } from "@/components/elements/pagination/FeedPagination";
import type { PaginationMetadata } from "@/components/elements/pagination/FeedPagination";
import { clientApi } from "@/lib/api/clientApi";
import { CommentFeedCard } from "@/components/modules/cards/CommentFeedCard";

export function CommentFeed() {
  const [comments, setComments] = useState<CommentFrontendPopulated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  async function fetchComments(page: number) {
    setIsLoading(true);
    try {
      const result = await clientApi.admin.read.comments({
        page,
        limit: 10,
      });

      if (result.success) {
        setComments(result.data);
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
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComments(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchComments(newPage);
  };

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        {comments.map((comment, index) => (
          <CommentFeedCard key={comment._id || index} item={comment} />
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
