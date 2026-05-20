"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { CopyIcon } from "@/components/elements/icons";
import { PencilIcon, SearchIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { ArtworkFilterDropdowns } from "../../inputs/ArtworkFilterDropdowns";
import { Skeleton } from "@/components/shadcn/skeleton";
import { clientApi } from "@/lib/api/clientApi";
import type { ArtworkFrontend } from "@/lib/data/types";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";
import { useAdminArchiveEntryPoint } from "@/components/modules/tabs/AdminCrudTabs";
import {
  AdminReadPagination,
  type AdminReadPaginationMetadata,
  createDefaultReadPaginationMetadata,
  normalizeAdminReadPaginationMetadata,
} from "./AdminReadPagination";

type ArtworkFilterKey = "decade" | "artstyle" | "medium" | "surface";

const ARTWORK_READ_PAGE_SIZE = 50;
const ARTWORK_READ_SEARCH_MAX_LENGTH = 80;

const defaultPaginationMetadata = createDefaultReadPaginationMetadata(
  ARTWORK_READ_PAGE_SIZE
);

export function ReadArtworkList() {
  const [artworks, setArtworks] = useState<ArtworkFrontend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<AdminReadPaginationMetadata>(
    defaultPaginationMetadata
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<{
    key: ArtworkFilterKey | null;
    value: string | null;
  }>({ key: null, value: null });
  const { selectEntryForOperation } = useAdminArchiveEntryPoint();

  useEffect(() => {
    let isActive = true;

    const fetchArtworks = async () => {
      const trimmedSearch = searchQuery.trim();

      try {
        setIsLoading(true);
        setError(null);
        const response = await clientApi.admin.read.artworks({
          page: currentPage,
          limit: ARTWORK_READ_PAGE_SIZE,
          ...(trimmedSearch ? { search: trimmedSearch } : {}),
          ...(activeFilter.key && activeFilter.value
            ? { filter: activeFilter }
            : {}),
        });

        if (!isActive) return;

        if (response.success) {
          setArtworks(response.data);
          setMetadata(
            normalizeAdminReadPaginationMetadata(
              response.metadata,
              currentPage,
              ARTWORK_READ_PAGE_SIZE
            )
          );
          return;
        }

        setArtworks([]);
        setMetadata(defaultPaginationMetadata);

        if (response.error !== "No artworks found") {
          setError(response.error || "Failed to fetch artworks");
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch artworks"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchArtworks();

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

  const handleFilterChange = (key: string | null, value: string | null) => {
    setActiveFilter({
      key: key as ArtworkFilterKey | null,
      value,
    });
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
      ? "No artworks found for this search and filter."
      : hasSearchQuery
      ? "No artworks found for this search."
      : hasActiveFilter
      ? "No artworks found for this filter."
      : "No artworks found on this page.";

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
          aria-label="Search artwork title"
          className="pl-9"
          maxLength={ARTWORK_READ_SEARCH_MAX_LENGTH}
          onChange={handleSearchChange}
          placeholder="Search title"
          type="search"
          value={searchQuery}
        />
      </div>
      <ArtworkFilterDropdowns onFilterChange={handleFilterChange} />
      {isLoading ? (
        <ArtworkListSkeleton />
      ) : (
        <>
          {artworks.length === 0 ? (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artworks.map((artwork) => (
                <div
                  key={artwork._id}
                  className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={getCloudinaryDeliveryUrl(
                        artwork.image.secure_url,
                        "adminPreview"
                      )}
                      alt={artwork.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium truncate">
                      {artwork.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {artwork.medium} on {artwork.surface}
                    </p>
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Update ${artwork.title}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: artwork._id,
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
                      aria-label={`Delete ${artwork.title}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: artwork._id,
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
                      aria-label={`Copy ${artwork.title} ID`}
                      onClick={() => handleCopyId(artwork._id)}
                    >
                      <CopyIcon />
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
              resourceLabel="artwork"
            />
          )}
        </>
      )}
    </div>
  );
}

export const ArtworkListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="rounded-lg h-[100px] w-[100px]" />
      ))}
    </div>
  );
};
