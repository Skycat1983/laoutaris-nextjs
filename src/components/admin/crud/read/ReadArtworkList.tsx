"use client";

import { useEffect, useState } from "react";
import { readArtworks } from "@/lib/api/admin/readApi";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import { CopyIcon } from "@/components/elements/icons/CopyIcon";
import Image from "next/image";
import { Button } from "@/components/shadcn/button";

export function ReadArtworkList() {
  const [artworks, setArtworks] = useState<FrontendArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await readArtworks();
        if (response.data) {
          setArtworks(response.data);
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
  }, []);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      console.log("Copied ID:", id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("artworks", artworks);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {artworks &&
        artworks.map((artwork) => (
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
              <h3 className="text-sm font-medium truncate">{artwork.title}</h3>
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
  );
}
