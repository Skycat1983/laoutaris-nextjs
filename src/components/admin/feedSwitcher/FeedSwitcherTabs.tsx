"use client";

import { FeedSkeleton } from "@/components/compositions/Feed";
import { Button } from "@/components/shadcn/button";
import { FEED_CONFIGS } from "@/config/feedsConfig";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Suspense } from "react";

// TODO: Load more note working correctly.

export function FeedSwitcherTabs() {
  const pathname = usePathname();
  const [selectedFeed, setSelectedFeed] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const defaultFeed = FEED_CONFIGS.find((config) =>
      config.defaultFor?.includes(pathname)
    );
    setSelectedFeed(defaultFeed?.key || FEED_CONFIGS[0].key);
    setIsLoading(false);
  }, [pathname]);

  const CurrentFeedComponent = FEED_CONFIGS.find(
    (config) => config.key === selectedFeed
  )?.component;

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 mb-4">
        {FEED_CONFIGS.map((config) => (
          <Button
            key={config.key}
            onClick={() => setSelectedFeed(config.key)}
            variant={selectedFeed === config.key ? "default" : "secondary"}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              selectedFeed === config.key
                ? "bg-black text-whitish"
                : "bg-gray-200"
            }`}
          >
            {config.title}
          </Button>
        ))}
      </div>

      {CurrentFeedComponent && (
        <div className="flex flex-col gap-4">
          <Suspense fallback={<FeedSkeleton />}>
            <CurrentFeedComponent page={page} />
          </Suspense>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="mt-4 w-32 p-4 bg-whitish rounded-full"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load More
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
