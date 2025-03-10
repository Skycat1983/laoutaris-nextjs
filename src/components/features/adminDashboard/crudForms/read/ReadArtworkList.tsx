"use client";

import { useEffect, useState } from "react";
import type { Artwork } from "@/lib/data/types/artworkTypes";
import { CopyIcon } from "@/components/elements/icons";
import Image from "next/image";
import { Button } from "@/components/shadcn/button";
import { ArtworkFilterDropdowns } from "../../inputs/ArtworkFilterDropdowns";
import { Skeleton } from "@/components/shadcn/skeleton";
import { clientApi } from "@/lib/api/clientApi";
import { AdminArtwork } from "@/lib/data/types";

type ArtworkFilterKey = "decade" | "artstyle" | "medium" | "surface";

export function ReadArtworkList() {
  const [artworks, setArtworks] = useState<AdminArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<{
    key: ArtworkFilterKey | null;
    value: string | null;
  }>({ key: null, value: null });

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        const response = await clientApi.admin.read.artworks({
          filter: activeFilter.key ? activeFilter : undefined,
        });
        if (response.success) {
          setArtworks(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch artworks"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtworks();
  }, [activeFilter]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      console.log("Copied ID:", id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFilterChange = (key: string | null, value: string | null) => {
    setActiveFilter({
      key: key as ArtworkFilterKey | null,
      value,
    });
  };

  if (error) return <div>Error: {error}</div>;

  console.log("artworks", artworks);

  return (
    <div className="p-4">
      <ArtworkFilterDropdowns onFilterChange={handleFilterChange} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artworks.map((artwork) => (
            <div
              key={artwork._id}
              className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={artwork.image.secure_url.replace(
                    "/upload/",
                    "/upload/w_200,h_200,c_fill/"
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
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopyId(artwork._id)}
              >
                <CopyIcon />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const ArtworkListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className=" rounded-lg h-[100px] w-[100px]" />
      ))}
    </div>
  );
};
