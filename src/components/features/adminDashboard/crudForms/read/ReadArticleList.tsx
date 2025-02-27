"use client";

import { useState, useEffect } from "react";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import type { FrontendArticleWithArtwork } from "@/lib/data/types/articleTypes";
import { ArticleFilterDropdowns } from "../../inputs/ArticleFilterDropdowns";
import { clientApi } from "@/lib/api/clientApi";

type FilterKey = "section" | "overlayColour" | null;

interface FilterState {
  key: FilterKey;
  value: string | null;
}

export function ReadArticleList() {
  const [articles, setArticles] = useState<FrontendArticleWithArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    key: null,
    value: null,
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await clientApi.admin.read.articles({
          page: 1,
          limit: 10,
        });
        if (response.success) {
          let filteredArticles = response.data;
          if (activeFilter.key && activeFilter.value) {
            filteredArticles = response.data.filter((article) => {
              const key = activeFilter.key;
              if (key === null) return true;

              return article[key] === activeFilter.value;
            });
          }
          setArticles(filteredArticles);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch articles"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [activeFilter]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      console.log("Copied ID:", id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFilterChange = (key: FilterKey, value: string | null) => {
    setActiveFilter({ key, value });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <ArticleFilterDropdowns onFilterChange={handleFilterChange} />
      {isLoading ? (
        <ArticleListSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {articles.map((article) => (
            <div
              key={article._id}
              className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={article.imageUrl.replace(
                    "/upload/",
                    "/upload/w_200,h_200,c_fill/"
                  )}
                  alt={article.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-medium truncate">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {article.section} - {article.overlayColour}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopyId(article._id)}
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

export function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="rounded-lg h-[200px] w-full" />
      ))}
    </div>
  );
}
