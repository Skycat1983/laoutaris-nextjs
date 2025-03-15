"use client";

import { ArticleFeedCard } from "@/components/modules/cards/ArticleFeedCard";
import { useEffect, useState } from "react";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { ArticleFrontendPopulated } from "@/lib/data/types";
import { FeedPagination } from "@/components/elements/pagination/FeedPagination";
import type { PaginationMetadata } from "@/components/elements/pagination/FeedPagination";
import { clientApi } from "@/lib/api/clientApi";
export function ArticleFeed() {
  const [articles, setArticles] = useState<ArticleFrontendPopulated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  async function fetchArticles(page: number) {
    setIsLoading(true);
    try {
      const result = await clientApi.admin.read.articles({
        page,
        limit: 10,
      });

      if (result.success) {
        setArticles(result.data);
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
      console.error("Failed to fetch articles:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchArticles(newPage);
  };

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        {articles.map((article, index) => (
          <ArticleFeedCard key={article._id || index} item={article} />
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
