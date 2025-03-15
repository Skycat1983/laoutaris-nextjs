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

      // Helper function to check if a value should be included
      const isValidValue = (value: any): boolean => {
        if (value === undefined || value === null) return false;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "number") return true;
        if (typeof value === "string") return value !== "";
        return true;
      };

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
      }}
    >
      <MasonryLayout
        artworks={artworks}
        hasMore={hasMore}
        onLoadMore={loadMoreArtworks}
        isLoading={isLoading}
      />
    </FilterDrawerWrapper>
  );
};
