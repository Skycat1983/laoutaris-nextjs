"use client";

import React from "react";
import type {
  FrontendComment,
  FrontendCommentUnpopulated,
} from "@/lib/data/types/commentTypes";

interface CommentsListProps {
  comments: FrontendCommentUnpopulated[];
}

export default function CommentsList({ comments }: CommentsListProps) {
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
        <div
          key={index}
          className="border-b bg-white w-full max-w-2xl mx-auto mt-8 p-8 rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow"
        >
          <p className="text-gray-800">{comment.text}</p>
          <p className="text-gray-500 text-xs">
            {new Date(comment.displayDate).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
