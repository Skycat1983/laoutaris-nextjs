"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  rootMargin?: string;
  threshold?: number;
}

interface UseInfiniteScrollReturn {
  observerRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: Error | null;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  rootMargin = "100px",
  threshold = 0,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true);
        try {
          await onLoadMore();
        } catch (err) {
          setError(
            err instanceof Error ? err : new Error("Failed to load more items")
          );
          console.error("Error in infinite scroll:", err);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin,
      threshold,
    });

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [handleObserver, rootMargin, threshold]);

  return { observerRef, isLoading, error };
};
