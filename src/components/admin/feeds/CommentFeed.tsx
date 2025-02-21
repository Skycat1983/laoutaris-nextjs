"use client";

import { CommentFeedCard } from "../../modules/cards/CommentFeedCard";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useEffect, useState } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import type { FrontendCommentWithAuthor } from "@/lib/data/types/commentTypes";

export function CommentFeed() {
  const [comments, setComments] = useState<FrontendCommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const result: ApiResponse<FrontendCommentWithAuthor[]> =
          await clientAdminApi.read.readComments({
            page: 1,
            limit: 10,
          });
        console.log("comments result", result);
        if (result.success) {
          setComments(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, []);

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4 p-4">
      {comments.map((comment, index) => (
        <CommentFeedCard key={comment._id || index} item={comment} />
      ))}
    </div>
  );
}

//! old code
// export function CommentFeed({ page = 1 }: { page?: number }) {
//   return (
//     <Feed
//       fetchFn={(params) => clientAdminApi.read.readComments({ ...params, page })}
//       CardComponent={CommentCard}
//       title="Comment Feed"
//     />
//   );
// }
