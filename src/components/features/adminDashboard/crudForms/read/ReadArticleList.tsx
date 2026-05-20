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
import type { ArticleFrontendPopulated } from "@/lib/data/types";
import { ArticleFilterDropdowns } from "../../inputs/ArticleFilterDropdowns";
import { clientApi } from "@/lib/api/clientApi";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";
import { useAdminArchiveEntryPoint } from "@/components/modules/tabs/AdminCrudTabs";
import {
  AdminReadPagination,
  type AdminReadPaginationMetadata,
  createDefaultReadPaginationMetadata,
  normalizeAdminReadPaginationMetadata,
} from "./AdminReadPagination";

type FilterKey = "section" | "overlayColour" | null;

interface FilterState {
  key: FilterKey;
  value: string | null;
}

const ARTICLE_READ_PAGE_SIZE = 10;
const ARTICLE_READ_SEARCH_MAX_LENGTH = 80;

const defaultPaginationMetadata = createDefaultReadPaginationMetadata(
  ARTICLE_READ_PAGE_SIZE
);

export function ReadArticleList() {
  const [articles, setArticles] = useState<ArticleFrontendPopulated[]>([]);
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

  useEffect(() => {
    let isActive = true;

    const fetchArticles = async () => {
      const trimmedSearch = searchQuery.trim();

      try {
        setIsLoading(true);
        setError(null);
        const response = await clientApi.admin.read.articles({
          page: currentPage,
          limit: ARTICLE_READ_PAGE_SIZE,
          ...(trimmedSearch ? { search: trimmedSearch } : {}),
          ...(activeFilter.key && activeFilter.value
            ? { filter: activeFilter }
            : {}),
        });

        if (!isActive) return;

        if (response.success) {
          setArticles(response.data);
          setMetadata(
            normalizeAdminReadPaginationMetadata(
              response.metadata,
              currentPage,
              ARTICLE_READ_PAGE_SIZE
            )
          );
          return;
        }

        setArticles([]);
        setMetadata(defaultPaginationMetadata);

        if (response.error !== "No articles found") {
          setError(response.error || "Failed to fetch articles");
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch articles"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchArticles();

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
      ? "No articles found for this search and filter."
      : hasSearchQuery
      ? "No articles found for this search."
      : hasActiveFilter
      ? "No articles found for this filter."
      : "No articles found on this page.";

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
          aria-label="Search article title or slug"
          className="pl-9"
          maxLength={ARTICLE_READ_SEARCH_MAX_LENGTH}
          onChange={handleSearchChange}
          placeholder="Search title or slug"
          type="search"
          value={searchQuery}
        />
      </div>
      <ArticleFilterDropdowns onFilterChange={handleFilterChange} />
      {isLoading ? (
        <ArticleListSkeleton />
      ) : (
        <>
          {articles.length === 0 ? (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={getCloudinaryDeliveryUrl(
                        article.imageUrl,
                        "adminPreview"
                      )}
                      alt={article.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {article.section} - {article.overlayColour}
                    </p>
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Update ${article.title}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: article._id,
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
                      aria-label={`Delete ${article.title}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: article._id,
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
                      aria-label={`Copy ${article.title} ID`}
                      onClick={() => handleCopyId(article._id)}
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
              resourceLabel="article"
            />
          )}
        </>
      )}
    </div>
  );
}

export function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="rounded-lg h-[200px] w-full" />
      ))}
    </div>
  );
}
