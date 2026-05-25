"use client";

import { useState } from "react";
import { MasonryLayout } from "../layouts/public/MasonryLayout";
import type {
  ArtworkFilterParams,
  ArtworkFrontend,
  ArtworkQueryParams,
} from "@/lib/data/types/artworkTypes";
import { clientApi } from "@/lib/api/clientApi";
import { FilterDrawerWrapper } from "./filters/FilterDrawerWrapper";
import type { ArtworkSortConfig } from "@/lib/data/types";
import { useRouter } from "next/navigation";
import type { FilterMode } from "@/lib/constants/artworkConstants";
import { ArtworkSortAndFilter } from "./filters/ArtworkSortAndFilter";
import { isValidValue } from "@/lib/helpers/validation";
import type { PaginationMetadata } from "@/lib/data/types/apiTypes";

interface ArtworkGalleryProps {
  startingArtworks: ArtworkFrontend[];
  paginationMetadata?: Required<PaginationMetadata>;
  sortDefaults?: ArtworkSortConfig;
  filterDefaults?: ArtworkFilterParams;
}

export const ArtworkGallery = ({
  startingArtworks,
  paginationMetadata,
  sortDefaults,
  filterDefaults,
}: ArtworkGalleryProps) => {
  const router = useRouter();
  const initialPage = paginationMetadata?.page ?? filterDefaults?.page ?? 1;
  const initialHasMore = paginationMetadata
    ? paginationMetadata.page < paginationMetadata.totalPages
    : true;
  const [artworks, setArtworks] = useState(startingArtworks);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState<ArtworkFilterParams>(
    filterDefaults || {
      filterMode: "ALL",
    }
  );
  const [filterMode, setFilterMode] = useState<FilterMode>(
    filterDefaults?.filterMode || "ALL"
  );
  const [filterError, setFilterError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [lastFilterRequest, setLastFilterRequest] =
    useState<ArtworkQueryParams | null>(null);

  const fetchFilteredArtworks = async (cleanFilters: ArtworkQueryParams) => {
    setFilterError(null);
    setLoadMoreError(null);

    if (Object.keys(cleanFilters).length === 0) {
      setArtworks(startingArtworks);
      setPage(initialPage);
      setHasMore(initialHasMore);
      return;
    }

    const response = await clientApi.public.artwork.multiple(cleanFilters);

    if (!response.success) {
      throw new Error("Failed to fetch artworks");
    }
    const { data: artworks, metadata } = response;

    setArtworks(artworks);
    setPage(1);
    setHasMore(metadata ? metadata.page < metadata.totalPages : true);
  };

  const handleFilterChange = async (
    newFilters: ArtworkFilterParams & { sort?: ArtworkSortConfig }
  ) => {
    try {
      setIsLoading(true);

      const { sort, ...filterParams } = newFilters;

      const cleanFilters: ArtworkQueryParams = {
        ...Object.fromEntries(
          Object.entries(filterParams).filter(([_, value]) =>
            isValidValue(value)
          )
        ),
        filterMode,
        ...(sort?.by && {
          sortBy: sort.by,
          ...(sort.color && { sortColor: sort.color }),
        }),
      };

      // Update URL parameters
      const searchParams = new URLSearchParams();
      Object.entries(cleanFilters).forEach(([key, value]) => {
        if (isValidValue(value)) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
          } else {
            searchParams.append(key, value as string);
          }
        }
      });

      router.push(`/artwork?${searchParams.toString()}`, { scroll: false });

      setFilters(cleanFilters);
      setLastFilterRequest(cleanFilters);

      await fetchFilteredArtworks(cleanFilters);
    } catch {
      setFilterError(
        "Unable to update the artwork filters. The current artworks are still shown."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const retryFilterFetch = async () => {
    if (!lastFilterRequest) return;

    try {
      setIsLoading(true);
      await fetchFilteredArtworks(lastFilterRequest);
    } catch {
      setFilterError(
        "Unable to update the artwork filters. The current artworks are still shown."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      filterMode: "ALL",
    });
    setArtworks(startingArtworks);
    setPage(initialPage);
    setHasMore(initialHasMore);
    setFilterError(null);
    setLoadMoreError(null);
    setLastFilterRequest(null);
  };

  const loadMoreArtworks = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setLoadMoreError(null);
    try {
      const nextPage = page + 1;
      const newArtworks = await clientApi.public.artwork.multiple({
        ...filters,
        page: nextPage,
        limit: 10,
      });

      if (!newArtworks.success) {
        throw new Error("Failed to fetch artworks");
      }
      const { data: nextArtworks, metadata } = newArtworks;

      if (nextArtworks.length === 0) {
        setHasMore(false);
      } else {
        const existingIds = new Set(artworks.map((artwork) => artwork._id));
        const uniqueNewArtworks = nextArtworks.filter(
          (artwork) => !existingIds.has(artwork._id)
        );

        if (uniqueNewArtworks.length === 0) {
          setHasMore(false);
          return;
        }

        setArtworks((prev) => [...prev, ...uniqueNewArtworks]);
        setPage(nextPage);
        setHasMore(metadata ? metadata.page < metadata.totalPages : true);
      }
    } catch {
      setLoadMoreError(
        "Unable to load more artworks. The artworks already loaded are still shown."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FilterDrawerWrapper
      filterComponent={ArtworkSortAndFilter}
      filterProps={{
        onFilterChange: handleFilterChange,
        onClearFilters: clearFilters,
        filterMode,
        onFilterModeChange: (mode: FilterMode) => setFilterMode(mode),
        sortDefaults,
        filterDefaults,
      }}
    >
      {filterError && (
        <div
          role="alert"
          className="mx-4 my-4 flex flex-col items-center gap-3 border border-red-200 bg-red-50 px-4 py-4 text-center text-red-700 md:mx-8"
        >
          <p>{filterError}</p>
          <button
            type="button"
            onClick={retryFilterFetch}
            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
          >
            Retry filters
          </button>
        </div>
      )}
      {artworks.length > 0 ? (
        <MasonryLayout
          artworks={artworks}
          hasMore={hasMore}
          onLoadMore={loadMoreArtworks}
          isLoading={isLoading}
          loadMoreError={loadMoreError}
          onRetryLoadMore={loadMoreArtworks}
        />
      ) : (
        <div className="flex justify-center py-4 text-center flex-col gap-4">
          <h1 className="text-2xl font-bold">No artworks found</h1>
          <p className="text-gray-500">
            Please try again with different filters
          </p>
        </div>
      )}
    </FilterDrawerWrapper>
  );
};
