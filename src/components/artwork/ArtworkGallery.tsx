"use client";

import { useState } from "react";
import { MasonryLayout } from "../layouts/public/MasonryLayout";
import {
  ArtworkFilterParams,
  ArtworkFrontend,
} from "@/lib/data/types/artworkTypes";
import { clientApi } from "@/lib/api/clientApi";
import { FilterDrawerWrapper } from "./filters/FilterDrawerWrapper";
import { ArtworkSortConfig } from "@/lib/data/types";
import { useRouter } from "next/navigation";
import { FilterMode } from "@/lib/constants";
import { ArtworkSortAndFilter } from "./filters/ArtworkSortAndFilter";
import { isValidValue } from "@/lib/utils/isValidValue";
interface ArtworkGalleryProps {
  initialArtworks: ArtworkFrontend[];
  initialSort?: ArtworkSortConfig;
  initialFilters?: ArtworkFilterParams;
}

export const ArtworkGallery = ({
  initialArtworks,
  initialSort,
  initialFilters,
}: ArtworkGalleryProps) => {
  console.log("initialArtworks", initialArtworks);
  console.log("initialSort", initialSort);
  console.log("initialFilters", initialFilters);
  const router = useRouter();
  const [artworks, setArtworks] = useState(initialArtworks);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ArtworkFilterParams>(
    initialFilters || {
      filterMode: "ALL",
    }
  );
  const [filterMode, setFilterMode] = useState<FilterMode>(
    initialFilters?.filterMode || "ALL"
  );

  const handleFilterChange = async (
    newFilters: ArtworkFilterParams & { sort?: ArtworkSortConfig }
  ) => {
    try {
      setIsLoading(true);

      const { sort, ...filterParams } = newFilters;

      const cleanFilters = {
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

      if (Object.keys(cleanFilters).length === 0) {
        setArtworks(initialArtworks);
        return;
      }

      const response = await clientApi.public.artwork.multiple(cleanFilters);

      if (!response.success) {
        throw new Error("Failed to fetch artworks");
      }
      const { data: artworks, metadata } = response;

      setArtworks(artworks);
    } catch (error) {
      console.error("Error fetching filtered artworks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      filterMode: "ALL",
    });
    setArtworks(initialArtworks);
  };

  const loadMoreArtworks = async () => {
    if (isLoading) return;

    setIsLoading(true);
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
      const { data: artworks, metadata } = newArtworks;

      if (artworks.length === 0) {
        setHasMore(false);
      } else {
        // addnew artworks abd preventing duplicates
        setArtworks((prev) => {
          const existingIds = new Set(prev.map((artwork) => artwork._id));
          const uniqueNewArtworks = artworks.filter(
            (artwork) => !existingIds.has(artwork._id)
          );

          if (uniqueNewArtworks.length === 0) {
            setHasMore(false);
            return prev;
          }

          return [...prev, ...uniqueNewArtworks];
        });
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more artworks:", error);
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
        initialSort,
        initialFilters,
      }}
    >
      {artworks.length > 0 ? (
        <MasonryLayout
          artworks={artworks}
          hasMore={hasMore}
          onLoadMore={loadMoreArtworks}
          isLoading={isLoading}
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
