"use client";

import { CommentFrontendPopulated } from "@/lib/data/types";
import { formatDateImproved } from "@/lib/utils/formatDate";
import { CopyIcon } from "lucide-react";
import { copy_id } from "@/lib/helpers/copy_id";

interface CommentFeedCardProps {
  item: CommentFrontendPopulated;
}

export function CommentFeedCard({ item }: CommentFeedCardProps) {
  const handleCopyId = copy_id();
  const paragraphs = item.text.replace(/\r\n/g, "\n").split(/\n\n+/);

  return (
    <div className="relative group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all">
      {/* Header with author info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-600 font-medium">
            {typeof item.author !== "string"
              ? item.author.username[0].toUpperCase()
              : "A"}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">
            {typeof item.author !== "string"
              ? item.author.username
              : "Anonymous"}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDateImproved(item.displayDate.toString())}
          </p>
        </div>
      </div>

      {/* Comment text */}
      <div className="prose prose-sm max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-relaxed line-clamp-2">
            {paragraph.trim()}
          </p>
        ))}
      </div>

      {/* Copy ID button */}
      <button
        onClick={() => handleCopyId(item)}
        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy ID"
      >
        <CopyIcon className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
}

export function CommentFeedCardSkeleton() {
  return <div className="w-full h-32 bg-gray-200 animate-pulse rounded-lg" />;
}
