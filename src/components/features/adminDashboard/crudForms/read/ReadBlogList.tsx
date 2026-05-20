"use client";

import { type ChangeEvent, useState, useEffect } from "react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  CopyIcon,
  PencilIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { BlogFilterDropdowns } from "../../inputs/BlogFilterDropdowns";
import { clientApi } from "@/lib/api/clientApi";
import type { BlogEntryFrontend } from "@/lib/data/types";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";
import { useAdminArchiveEntryPoint } from "@/components/modules/tabs/AdminCrudTabs";
import {
  AdminReadPagination,
  type AdminReadPaginationMetadata,
  createDefaultReadPaginationMetadata,
  normalizeAdminReadPaginationMetadata,
} from "./AdminReadPagination";

type FilterKey = "featured" | "year" | null;

interface FilterState {
  key: FilterKey;
  value: string | null;
}

const BLOG_READ_PAGE_SIZE = 10;
const BLOG_READ_MIN_YEAR = 1900;
const BLOG_READ_SEARCH_MAX_LENGTH = 80;

const getCurrentYearFilterOptions = () => {
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: currentYear - BLOG_READ_MIN_YEAR + 1 },
    (_, index) => (currentYear - index).toString()
  );
};

const defaultPaginationMetadata =
  createDefaultReadPaginationMetadata(BLOG_READ_PAGE_SIZE);

export function ReadBlogList() {
  const [blogs, setBlogs] = useState<BlogEntryFrontend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<AdminReadPaginationMetadata>(
    defaultPaginationMetadata
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    key: null,
    value: null,
  });
  const { selectEntryForOperation } = useAdminArchiveEntryPoint();
  const yearOptions = getCurrentYearFilterOptions();

  useEffect(() => {
    let isActive = true;

    const fetchBlogs = async () => {
      const trimmedSearch = searchQuery.trim();

      try {
        setIsLoading(true);
        setError(null);
        const response = await clientApi.admin.read.blogs({
          page: currentPage,
          limit: BLOG_READ_PAGE_SIZE,
          ...(trimmedSearch ? { search: trimmedSearch } : {}),
          ...(activeFilter.key && activeFilter.value
            ? { filter: activeFilter }
            : {}),
        });

        if (!isActive) return;

        if (response.success) {
          setBlogs(response.data);
          setMetadata(
            normalizeAdminReadPaginationMetadata(
              response.metadata,
              currentPage,
              BLOG_READ_PAGE_SIZE
            )
          );
          return;
        }

        setBlogs([]);
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
  }, [currentPage, activeFilter, searchQuery]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      return;
    }
  };

  const handleFilterChange = (key: FilterKey, value: string | null) => {
    setActiveFilter({ key, value });
    setCurrentPage(1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasActiveFilter = Boolean(activeFilter.key && activeFilter.value);
  const emptyMessage =
    hasSearchQuery && hasActiveFilter
      ? "No blogs found for this search and filter."
      : hasSearchQuery
      ? "No blogs found for this search."
      : hasActiveFilter
      ? "No blogs found for this filter."
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
      <div className="relative mb-4 w-full max-w-sm">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />
        <Input
          aria-label="Search blog title or slug"
          className="pl-9"
          maxLength={BLOG_READ_SEARCH_MAX_LENGTH}
          onChange={handleSearchChange}
          placeholder="Search title or slug"
          type="search"
          value={searchQuery}
        />
      </div>
      <BlogFilterDropdowns
        onFilterChange={handleFilterChange}
        yearOptions={yearOptions}
      />
      {isLoading ? (
        <BlogListSkeleton />
      ) : (
        <>
          {blogs.length === 0 ? (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {blogs.map((blog) => (
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
            <AdminReadPagination
              metadata={metadata}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
              resourceLabel="blog"
            />
          )}
        </>
      )}
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
