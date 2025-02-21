"use client";

import { Button } from "@/components/shadcn/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FeedPaginationProps {
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function FeedPagination({
  metadata,
  onPageChange,
  isLoading,
}: FeedPaginationProps) {
  const { page, totalPages } = metadata;

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex justify-center items-center w-full px-4 py-2 gap-8">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious || isLoading}
        className="flex items-center gap-2 outline-none border border-2 border-black rounded"
      >
        <ChevronLeft className="h-4 w-4" />
        {/* Previous */}
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <Button
        // variant="outline"
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext || isLoading}
        className="flex items-center gap-2 outline-none border border-2 border-black rounded"
      >
        {/* Next */}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
