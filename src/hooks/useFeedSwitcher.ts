"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FEED_CONFIGS } from "@/config/feedsConfig";
import type { FeedConfig } from "@/config/feedsConfig";

export type UseFeedSwitcherReturn = {
  selectedFeed: string;
  setSelectedFeed: (feed: string) => void;
  availableFeeds: FeedConfig[];
  currentFeedComponent: React.ComponentType | null;
  isLoading: boolean;
};

//!: RENDERPROPS PATTERN
// 1. FeedSwitcher
// 2. FeedSwitcherHeadless
/* 
3. useFeedSwitcher (Custom Hook)
   - This hook encapsulates all the stateful logic needed for switching feeds.
   - It manages:
     • the currently selected feed,
     • the loading state,
     • the available feeds list,
     • and resolves the component to render for the current feed.
   - By keeping this logic in a hook, it’s isolated and can be reused or tested separately.
*/
// 4. FeedSwitcherUI

export function useFeedSwitcher(): UseFeedSwitcherReturn {
  const pathname = usePathname();
  const [selectedFeed, setSelectedFeed] = useState<string>(FEED_CONFIGS[0].key);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const defaultFeed = FEED_CONFIGS.find((config) =>
      config.defaultFor?.includes(pathname)
    );
    setSelectedFeed(defaultFeed?.key || FEED_CONFIGS[0].key);
    setIsLoading(false);
  }, [pathname]);

  const currentFeedComponent =
    FEED_CONFIGS.find((config) => config.key === selectedFeed)?.component ||
    null;

  return {
    selectedFeed,
    setSelectedFeed,
    availableFeeds: FEED_CONFIGS,
    currentFeedComponent,
    isLoading,
  };
}
