"use client";

import React from "react";
import { FrontendCommentWithAuthor } from "@/lib/data/types/commentTypes";
import { CommentCard } from "../modules/cards/CommentCard";

interface CommentsListProps {
  comments: FrontendCommentWithAuthor[];
  onCommentUpdated: () => void;
}

export default function BlogCommentsList({
  comments,
  onCommentUpdated,
}: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
          onCommentUpdated={onCommentUpdated}
        />
      ))}
    </div>
  );
}
