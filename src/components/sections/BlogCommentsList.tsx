"use client";

import React from "react";
import type { FrontendCommentUnpopulated } from "@/lib/data/types/commentTypes";
import { CommentCard } from "../modules/cards/CommentCard";

interface CommentsListProps {
  comments: FrontendCommentUnpopulated[];
}

export default function BlogCommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))}
    </div>
  );
}
