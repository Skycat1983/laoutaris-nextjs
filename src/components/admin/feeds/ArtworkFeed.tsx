"use client";

import { ArtworkFeedCard } from "../../modules/cards/ArtworkFeedCard";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useEffect, useState } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";

export function ArtworkFeed() {
  const [artworks, setArtworks] = useState<FrontendArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const result = await clientAdminApi.read.readArtworks({
          page: 1,
          limit: 10,
        });
        if (result.success) {
          setArtworks(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtworks();
  }, []);

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4 p-4">
      {artworks.map((artwork, index) => (
        <ArtworkFeedCard key={artwork._id || index} item={artwork} />
      ))}
    </div>
  );
}

//! old code
// export function ArtworkFeed({ page = 1 }: { page?: number }) {
//   return (
//     <Feed
//       fetchFn={(params) =>
//         clientAdminApi.read.readArtworks({ ...params, page })
//       }
//       CardComponent={ArtworkFeedCard}
//       title="Artwork Feed"
//     />
//   );
// }
