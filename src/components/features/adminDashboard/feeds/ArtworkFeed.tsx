"use client";

import { ArtworkFeedCard } from "@/components/modules/cards/ArtworkFeedCard";
import { useEffect, useState } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { FeedPagination } from "@/components/elements/pagination/FeedPagination";
import type { PaginationMetadata } from "@/components/elements/pagination/FeedPagination";
import { clientApi } from "@/lib/api/clientApi";
import { ArtworkFrontend } from "@/lib/data/types";

export function ArtworkFeed() {
  const [artworks, setArtworks] = useState<ArtworkFrontend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  async function fetchArtworks(page: number) {
    setIsLoading(true);
    try {
      const result = await clientApi.admin.read.artworks({
        page,
        limit: 10,
      });

      if (result.success) {
        setArtworks(result.data);
        if (result.metadata) {
          setMetadata({
            page: result.metadata.page ?? 1,
            limit: result.metadata.limit ?? 10,
            total: result.metadata.total ?? 0,
            totalPages: result.metadata.totalPages ?? 1,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchArtworks(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchArtworks(newPage);
  };

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        {artworks.map((artwork, index) => (
          <ArtworkFeedCard key={artwork._id || index} item={artwork} />
        ))}
      </div>
      <FeedPagination
        metadata={metadata}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
