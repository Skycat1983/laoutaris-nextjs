"use client";

import { CollectionFeedCard } from "../../modules/cards/CollectionFeedCard";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useEffect, useState } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import type { FrontendCollection } from "@/lib/data/types/collectionTypes";

export function CollectionFeed() {
  const [collections, setCollections] = useState<FrontendCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const result = await clientAdminApi.read.readCollections({
          page: 1,
          limit: 10,
        });
        console.log("result", result);
        if (result.success) {
          setCollections(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollections();
  }, []);

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4 p-4">
      {collections.map((collection, index) => (
        <CollectionFeedCard key={collection._id || index} item={collection} />
      ))}
    </div>
  );
}

//! old code
// export function CollectionFeed({ page = 1 }: { page?: number }) {
//   return (
//     <Feed
//       fetchFn={(params) => clientAdminApi.read.readCollections({ ...params, page })}
//       CardComponent={CollectionFeedCard}
//       title="Collection Feed"
//     />
//   );
// }
