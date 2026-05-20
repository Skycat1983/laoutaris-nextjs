"use client";

import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import {
  BlogFilterDropdowns,
  deriveBlogYearOptions,
} from "../../inputs/BlogFilterDropdowns";
import { clientApi } from "@/lib/api/clientApi";
import type { BlogEntryFrontend } from "@/lib/data/types";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";
import { useAdminArchiveEntryPoint } from "@/components/modules/tabs/AdminCrudTabs";

type FilterKey = "featured" | "year" | null;

interface FilterState {
  key: FilterKey;
  value: string | null;
}

interface BlogReadPaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const BLOG_READ_PAGE_SIZE = 10;

const defaultPaginationMetadata: BlogReadPaginationMetadata = {
  page: 1,
  limit: BLOG_READ_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

const normalizePaginationMetadata = (
  metadata: Partial<BlogReadPaginationMetadata> | undefined,
  fallbackPage: number
): BlogReadPaginationMetadata => ({
  page: metadata?.page ?? fallbackPage,
  limit: metadata?.limit ?? BLOG_READ_PAGE_SIZE,
  total: metadata?.total ?? 0,
  totalPages: Math.max(metadata?.totalPages ?? 1, 1),
});

const filterBlogsForVisiblePage = (
  blogs: BlogEntryFrontend[],
  activeFilter: FilterState
) => {
  if (!activeFilter.key || !activeFilter.value) return blogs;

  return blogs.filter((blog) => {
    if (activeFilter.key === "featured") {
      return blog.featured === (activeFilter.value === "true");
    }

    if (activeFilter.key === "year") {
      const blogYear = new Date(blog.displayDate).getFullYear().toString();
      return blogYear === activeFilter.value;
    }

    return true;
  });
};

export function ReadBlogList() {
  const [blogs, setBlogs] = useState<BlogEntryFrontend[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<BlogReadPaginationMetadata>(
    defaultPaginationMetadata
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    key: null,
    value: null,
  });
  const { selectEntryForOperation } = useAdminArchiveEntryPoint();
  const visibleBlogs = useMemo(
    () => filterBlogsForVisiblePage(blogs, activeFilter),
    [blogs, activeFilter]
  );

  useEffect(() => {
    let isActive = true;

    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await clientApi.admin.read.blogs({
          page: currentPage,
          limit: BLOG_READ_PAGE_SIZE,
        });

        if (!isActive) return;

        if (response.success) {
          setBlogs(response.data);
          setYearOptions(deriveBlogYearOptions(response.data));
          setMetadata(
            normalizePaginationMetadata(response.metadata, currentPage)
          );
          return;
        }

        setBlogs([]);
        setYearOptions([]);
        setMetadata(defaultPaginationMetadata);

        if (response.error !== "No blogs found") {
          setError(response.error || "Failed to fetch blogs");
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch blogs"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      isActive = false;
    };
  }, [currentPage]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      return;
    }
  };

  const handleFilterChange = (key: FilterKey, value: string | null) => {
    setActiveFilter({ key, value });
  };

  const emptyMessage =
    activeFilter.key && activeFilter.value
      ? "No blogs match this filter on the current page."
      : "No blogs found on this page.";

  if (error) {
    return (
      <div className="p-4" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <BlogFilterDropdowns
        onFilterChange={handleFilterChange}
        yearOptions={yearOptions}
      />
      {isLoading ? (
        <BlogListSkeleton />
      ) : (
        <>
          {visibleBlogs.length === 0 ? (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={getCloudinaryDeliveryUrl(
                        blog.imageUrl,
                        "adminPreview"
                      )}
                      alt={blog.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium truncate">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {new Date(blog.displayDate).toLocaleDateString()} -
                      {blog.featured ? " Featured" : " Not Featured"}
                    </p>
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Update ${blog.title}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: blog._id,
                          operation: "update",
                        })
                      }
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${blog.title}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: blog._id,
                          operation: "delete",
                        })
                      }
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Copy ${blog.title} ID`}
                      onClick={() => handleCopyId(blog._id)}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {metadata.total > 0 && (
            <BlogReadPagination
              metadata={metadata}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
}

interface BlogReadPaginationProps {
  metadata: BlogReadPaginationMetadata;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

function BlogReadPagination({
  metadata,
  onPageChange,
  isLoading,
}: BlogReadPaginationProps) {
  const hasPrevious = metadata.page > 1;
  const hasNext = metadata.page < metadata.totalPages;

  return (
    <div className="flex justify-center items-center w-full px-4 py-2 gap-8 mt-4">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label="Previous blog page"
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
        aria-label="Next blog page"
        onClick={() => onPageChange(metadata.page + 1)}
        disabled={!hasNext || isLoading}
        className="flex items-center gap-2 outline-none border border-2 border-black rounded"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="rounded-lg h-[200px] w-full" />
      ))}
    </div>
  );
}
