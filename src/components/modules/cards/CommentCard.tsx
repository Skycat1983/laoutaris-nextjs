import { Skeleton } from "@/components/shadcn/skeleton";
import { FrontendComment } from "@/lib/data/types/commentTypes";
import React from "react";

type Props = {
  comment: FrontendComment;
};

export const CommentCardSkeleton = () => {
  return (
    <Skeleton className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow" />
  );
};

export const CommentCard = ({ comment }: Props) => {
  return (
    <>
      <div className="border-b bg-white w-full max-w-2xl mx-auto mt-8 p-8 rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow">
        <p className="text-gray-800">{comment.text}</p>
        <p className="text-gray-500 text-xs">
          {new Date(comment.displayDate).toLocaleString()}
        </p>
      </div>
    </>
  );
};
