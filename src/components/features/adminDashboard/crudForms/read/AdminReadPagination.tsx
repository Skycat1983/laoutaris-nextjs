"use client";

import { Button } from "@/components/shadcn/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export interface AdminReadPaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const createDefaultReadPaginationMetadata = (
  limit: number
): AdminReadPaginationMetadata => ({
  page: 1,
  limit,
  total: 0,
  totalPages: 1,
});

export const normalizeAdminReadPaginationMetadata = (
  metadata: Partial<AdminReadPaginationMetadata> | undefined,
  fallbackPage: number,
  fallbackLimit: number
): AdminReadPaginationMetadata => ({
  page: metadata?.page ?? fallbackPage,
  limit: metadata?.limit ?? fallbackLimit,
  total: metadata?.total ?? 0,
  totalPages: Math.max(metadata?.totalPages ?? 1, 1),
});

interface AdminReadPaginationProps {
  metadata: AdminReadPaginationMetadata;
  onPageChange: (page: number) => void;
  resourceLabel: string;
  isLoading?: boolean;
}

export function AdminReadPagination({
  metadata,
  onPageChange,
  resourceLabel,
  isLoading,
}: AdminReadPaginationProps) {
  const hasPrevious = metadata.page > 1;
  const hasNext = metadata.page < metadata.totalPages;

  return (
    <div className="flex justify-center items-center w-full px-4 py-2 gap-8 mt-4">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label={`Previous ${resourceLabel} page`}
        onClick={() => onPageChange(metadata.page - 1)}
        disabled={!hasPrevious || isLoading}
        className="flex items-center gap-2 outline-none border border-2 border-black rounded"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <span className="text-sm text-gray-600">
        Page {metadata.page} of {metadata.totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label={`Next ${resourceLabel} page`}
        onClick={() => onPageChange(metadata.page + 1)}
        disabled={!hasNext || isLoading}
        className="flex items-center gap-2 outline-none border border-2 border-black rounded"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
