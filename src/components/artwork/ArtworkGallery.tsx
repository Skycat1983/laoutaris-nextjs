"use client";

import { useState } from "react";
import { MasonryLayout } from "../layouts/public/MasonryLayout";
import {
  ArtworkFilterParams,
  PublicFrontendArtwork,
  FilterMode,
} from "@/lib/data/types/artworkTypes";
import { clientApi } from "@/lib/api/clientApi";
import {
  artworkToPublic,
  PublicArtwork,
} from "@/lib/transforms/artworkToPublic";
import { BasicAccordionFilter } from "./filters/BasicAccordionFilter";

interface ArtworkGalleryProps {
  initialArtworks: PublicArtwork[];
}

export const ArtworkGallery = ({ initialArtworks }: ArtworkGalleryProps) => {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="flex min-h-screen">
      <BasicAccordionFilter
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filterMode={filterMode}
        onFilterModeChange={(mode) => setFilterMode(mode as FilterMode)}
      />
      <main className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <MasonryLayout artworks={artworks} />
        )}
      </main>
    </div>
  );
};
