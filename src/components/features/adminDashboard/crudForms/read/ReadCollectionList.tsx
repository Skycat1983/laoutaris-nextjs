"use client";

import { type ChangeEvent, useState, useEffect } from "react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { CopyIcon, PencilIcon, SearchIcon, Trash2Icon } from "lucide-react";
import type { CollectionFrontendPopulated } from "@/lib/data/types";
import { clientApi } from "@/lib/api/clientApi";
import { useAdminArchiveEntryPoint } from "@/components/modules/tabs/AdminCrudTabs";
import {
  AdminReadPagination,
  type AdminReadPaginationMetadata,
  createDefaultReadPaginationMetadata,
  normalizeAdminReadPaginationMetadata,
} from "./AdminReadPagination";

// TODO: when we click on a collection, we should fetch and render the artworks

const COLLECTION_READ_PAGE_SIZE = 10;
const COLLECTION_READ_SEARCH_MAX_LENGTH = 80;

const defaultPaginationMetadata = createDefaultReadPaginationMetadata(
  COLLECTION_READ_PAGE_SIZE
);

export function ReadCollectionList() {
  const [collections, setCollections] = useState<CollectionFrontendPopulated[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<AdminReadPaginationMetadata>(
    defaultPaginationMetadata
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectEntryForOperation } = useAdminArchiveEntryPoint();

  useEffect(() => {
    let isActive = true;

    const fetchCollections = async () => {
      const trimmedSearch = searchQuery.trim();

      try {
        setIsLoading(true);
        setError(null);
        const response = await clientApi.admin.read.collections({
          page: currentPage,
          limit: COLLECTION_READ_PAGE_SIZE,
          ...(trimmedSearch ? { search: trimmedSearch } : {}),
        });

        if (!isActive) return;

        if (response.success) {
          setCollections(response.data);
          setMetadata(
            normalizeAdminReadPaginationMetadata(
              response.metadata,
              currentPage,
              COLLECTION_READ_PAGE_SIZE
            )
          );
          return;
        }

        setCollections([]);
        setMetadata(defaultPaginationMetadata);

        if (response.error !== "No collections found") {
          setError(response.error || "Failed to fetch collections");
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch collections"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchCollections();

    return () => {
      isActive = false;
    };
  }, [currentPage, searchQuery]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      return;
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const hasSearchQuery = searchQuery.trim().length > 0;
  const emptyMessage = hasSearchQuery
    ? "No collections found for this search."
    : "No collections found on this page.";

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
          aria-label="Search collection title or slug"
          className="pl-9"
          maxLength={COLLECTION_READ_SEARCH_MAX_LENGTH}
          onChange={handleSearchChange}
          placeholder="Search title or slug"
          type="search"
          value={searchQuery}
        />
      </div>
      {isLoading ? (
        <CollectionListSkeleton />
      ) : (
        <>
          {collections.length === 0 ? (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collections.map((collection) => (
                <div
                  key={collection._id}
                  className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-medium truncate">
                      {collection.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {collection.artworks.length} artworks
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {collection.summary}
                    </p>
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Update ${collection.title}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: collection._id,
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
                      aria-label={`Delete ${collection.title}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: collection._id,
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
                      aria-label={`Copy ${collection.title} ID`}
                      onClick={() => handleCopyId(collection._id)}
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
              resourceLabel="collection"
            />
          )}
        </>
      )}
    </div>
  );
}

export function CollectionListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}
