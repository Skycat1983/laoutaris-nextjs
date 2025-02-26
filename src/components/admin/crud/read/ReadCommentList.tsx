"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import { CopyIcon } from "lucide-react";
import type {
  FrontendComment,
  FrontendCommentWithAuthor,
} from "@/lib/data/types/commentTypes";
import { clientApi } from "@/lib/api/clientApi";

export function ReadCommentList() {
  const [comments, setComments] = useState<FrontendCommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await clientApi.admin.read.comments({
          page: 1,
          limit: 10,
        });
        if (response.success) {
          setComments(response.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch comments"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      console.log("Copied ID:", id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      {isLoading ? (
        <CommentListSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <p className="text-xs text-gray-500">
                  By: {comment.author.username}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {comment.text}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopyId(comment._id)}
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

export function CommentListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4">
          <Skeleton className="h-3 w-1/3 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
