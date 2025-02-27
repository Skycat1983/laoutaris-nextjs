"use client";

import { CollectionFeedCard } from "@/components/modules/cards/CollectionFeedCard";
import { useEffect, useState } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import type { FrontendCollection } from "@/lib/data/types/collectionTypes";
import { FeedPagination } from "@/components/elements/pagination/FeedPagination";
import type { PaginationMetadata } from "@/components/elements/pagination/FeedPagination";
import { clientApi } from "@/lib/api/clientApi";
export function CollectionFeed() {
  const [collections, setCollections] = useState<FrontendCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  async function fetchCollections(page: number) {
    setIsLoading(true);
    try {
      const result = await clientApi.admin.read.collections({
        page,
        limit: 10,
      });

      if (result.success) {
        setCollections(result.data);
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
      console.error("Failed to fetch collections:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCollections(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchCollections(newPage);
  };

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        {collections.map((collection, index) => (
          <CollectionFeedCard key={collection._id || index} item={collection} />
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
