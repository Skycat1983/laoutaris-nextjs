"use client";

import { useState } from "react";
import { MasonryLayout } from "../layouts/public/MasonryLayout";
import { ArtworkFilterParams, FilterMode } from "@/lib/data/types/artworkTypes";
import { clientApi } from "@/lib/api/clientApi";
import {
  artworkToPublic,
  PublicArtwork,
} from "@/lib/transforms/artworkToPublic";
import { BasicAccordionFilter } from "./filters/BasicAccordionFilter";
import { FilterDrawerWrapper } from "./filters/FilterDrawerWrapper";

interface ArtworkGalleryProps {
  initialArtworks: PublicArtwork[];
}

export const ArtworkGallery = ({ initialArtworks }: ArtworkGalleryProps) => {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ArtworkFilterParams>({
    filterMode: "ALL",
  });
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");

  const handleFilterChange = async (
    newFilters: Partial<ArtworkFilterParams>
  ) => {
    try {
      setIsLoading(true);
      const cleanFilters = {
        ...Object.fromEntries(
          Object.entries(newFilters).filter(([_, value]) => value !== undefined)
        ),
        filterMode,
      } as ArtworkFilterParams;

      setFilters(cleanFilters);

      if (Object.keys(cleanFilters).length === 0) {
        setArtworks(initialArtworks);
        return;
      }

      const response = await clientApi.public.artwork.fetchArtworks(
        cleanFilters
      );
      console.log("response", response);
      if (!response.success) {
        throw new Error("Failed to fetch artworks");
      }

      const publicArtworks = response.data.map((artwork) =>
        artworkToPublic(artwork)
      );
      setArtworks(publicArtworks);
    } catch (error) {
      console.error("Error fetching filtered artworks:", error);
      // Handle error state
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
      const newArtworks = await clientApi.public.artwork.fetchArtworks({
        ...filters,
        page: nextPage,
        limit: 10, // or whatever your limit is
      });

      if (!newArtworks.success) {
        throw new Error("Failed to fetch artworks");
      }

      const publicArtworks = newArtworks.data.map((artwork) =>
        artworkToPublic(artwork)
      );

      if (publicArtworks.length === 0) {
        setHasMore(false);
      } else {
        setArtworks((prev) => [...prev, ...publicArtworks]);
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
      filterComponent={BasicAccordionFilter}
      filterProps={{
        onFilterChange: handleFilterChange,
        onClearFilters: clearFilters,
        filterMode,
        onFilterModeChange: (mode: FilterMode) => setFilterMode(mode),
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
