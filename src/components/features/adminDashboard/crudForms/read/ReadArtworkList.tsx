"use client";

import { useEffect, useState } from "react";
import { CopyIcon } from "@/components/elements/icons";
import { PencilIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/shadcn/button";
import { ArtworkFilterDropdowns } from "../../inputs/ArtworkFilterDropdowns";
import { Skeleton } from "@/components/shadcn/skeleton";
import { clientApi } from "@/lib/api/clientApi";
import type { ArtworkFrontend } from "@/lib/data/types";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";
import { useAdminArchiveEntryPoint } from "@/components/modules/tabs/AdminCrudTabs";

type ArtworkFilterKey = "decade" | "artstyle" | "medium" | "surface";

export function ReadArtworkList() {
  const [artworks, setArtworks] = useState<ArtworkFrontend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<{
    key: ArtworkFilterKey | null;
    value: string | null;
  }>({ key: null, value: null });
  const { selectEntryForOperation } = useAdminArchiveEntryPoint();

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
    } catch {
      return;
    }
  };

  const handleFilterChange = (key: string | null, value: string | null) => {
    setActiveFilter({
      key: key as ArtworkFilterKey | null,
      value,
    });
  };

  if (error) return <div>Error: {error}</div>;

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
