"use client";

import { ArticleFeedCard } from "../../modules/cards/ArticleFeedCard";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { Suspense } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";

// Client wrapper component
export function ArticleFeed({ page = 1 }: { page?: number }) {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <AsyncArticleFeed page={page} />
    </Suspense>
  );
}

// Async server component
async function AsyncArticleFeed({ page }: { page: number }) {
  const result = await clientAdminApi.read.readArticles({ page, limit: 10 });

  if (!result.success) {
    throw new Error(result.error);
  }

  return (
    <div className="w-full">
      {result.data.map((item, index) => (
        <ArticleFeedCard key={index} item={item} />
      ))}
    </div>
  );
}
