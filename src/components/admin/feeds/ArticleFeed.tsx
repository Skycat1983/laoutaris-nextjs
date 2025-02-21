"use client";

import { ArticleFeedCard } from "../../modules/cards/ArticleFeedCard";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useEffect, useState } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import type { FrontendArticleWithArtwork } from "@/lib/data/types/articleTypes";

export function ArticleFeed() {
  const [articles, setArticles] = useState<FrontendArticleWithArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const result = await clientAdminApi.read.readArticles({
          page: 1,
          limit: 10,
        });
        if (result.success) {
          setArticles(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []); // Empty dependency array

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4 p-4">
      {articles.map((article, index) => (
        <ArticleFeedCard key={article._id || index} item={article} />
      ))}
    </div>
  );
}
