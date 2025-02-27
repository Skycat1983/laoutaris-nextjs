"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import { CopyIcon } from "lucide-react";
import type { FrontendCollectionWithArtworks } from "@/lib/data/types/collectionTypes";
import { clientApi } from "@/lib/api/clientApi";

// TODO: when we click on a collection, we should fetch and render the artworks

export function ReadCollectionList() {
  const [collections, setCollections] = useState<
    FrontendCollectionWithArtworks[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const response = await clientApi.admin.read.collections({
          page: 1,
          limit: 10,
        });
        if (response.success) {
          setCollections(response.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch collections"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      console.log("Copied ID:", id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      {isLoading ? (
        <CollectionListSkeleton />
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
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopyId(collection._id)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
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
