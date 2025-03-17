"use client";

import React from "react";
import { CommentCard } from "../modules/cards/CommentCard";
import { CommentFrontendPopulated } from "@/lib/data/types";
interface CommentsListProps {
  comments: CommentFrontendPopulated[];
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
}

export function BlogCommentsList({
  comments,
  onCommentUpdated,
  onCommentDeleted,
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
      {comments.map((comment, i) => (
        <CommentCard
          key={i}
          comment={comment}
          onCommentUpdated={onCommentUpdated}
          onCommentDeleted={onCommentDeleted}
        />
      ))}
    </div>
  );
}
