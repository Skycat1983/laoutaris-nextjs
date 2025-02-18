import { Skeleton } from "@/components/shadcn/skeleton";
import { FrontendComment } from "@/lib/data/types/commentTypes";
import { formatDateImproved } from "@/lib/utils/formatDate";
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
  const paragraphs = comment.text.replace(/\r\n/g, "\n").split(/\n\n+/);
  return (
    <>
      <div className="border-b bg-white w-full max-w-2xl mx-auto mt-8 p-8 rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={`m-2 leading-8 prose-lg py-2 }`}>
            {paragraph.trim()}
          </p>
        ))}
        <p className="text-sm">
          {formatDateImproved(comment.displayDate.toString())}
        </p>
      </div>
    </>
  );
};
