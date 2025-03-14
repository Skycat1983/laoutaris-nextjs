"use client";

import React, { ReactNode, useRef, useState, useEffect } from "react";
import {
  ArtworkPaginationItem,
  ArtworkPaginationItemSkeleton,
} from "./ArtworkPaginationItem";
import CollectionInfo from "../wip/CollectionInfo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { ArtworkFrontend } from "@/lib/data/types";

interface ScrollablePaginationProps {
  items: (ArtworkFrontend & { link: string })[];
  heading: string;
}

const ScrollableLayout = ({ children }: { children: ReactNode }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 400;
    const newScrollPosition =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  const handleScrollCheck = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScrollCheck);
      // Initial check
      handleScrollCheck();

      return () =>
        scrollContainer.removeEventListener("scroll", handleScrollCheck);
    }
  }, []);

  return (
    <div className="relative w-full group px-16">
      {showLeftButton && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => handleScroll("left")}
          className="absolute left-2 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex items-start justify-start pl-4 gap-12 overflow-x-auto scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          minHeight: "400px",
        }}
      >
        {children}
      </div>

      {showRightButton && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => handleScroll("right")}
          className="absolute right-2 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export function ScrollableArtworkPagination({
  items,
  heading,
}: ScrollablePaginationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    // Reset states when items change
    setIsLoading(true);
    setVisibleItems([]);

    // LOADING PHASE DURATION
    // This controls how long to show the skeleton loading state
    // Increase this value if images are taking longer to load
    // Decrease for faster perceived loading (but risk showing partial images)
    const loadingDuration = 800; // milliseconds

    // Show loading state for the specified duration
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);

      // REVEAL DELAY
      // This is a small buffer between hiding skeletons and showing content
      // Useful to ensure smooth transition between states
      const revealDelay = 100; // milliseconds

      const revealItems = () => {
        // ITEM APPEARANCE DELAY
        // Controls delay before items start to appear
        // Increase if you notice images aren't fully loaded yet
        const itemAppearanceDelay = 200; // milliseconds

        setTimeout(() => {
          setVisibleItems(Array.from({ length: items.length }, (_, i) => i));
        }, itemAppearanceDelay);
      };

      // Start revealing items after the reveal delay
      setTimeout(revealItems, revealDelay);
    }, loadingDuration);

    return () => clearTimeout(loadingTimer);
  }, [items]);

  // TODO: heading with Collection Info or others
  return (
    <>
      <div className="py-8">
        <div className="py-8 container mx-auto">
          <HorizontalDivider />
        </div>
        <h1 className="text-5xl text-left font-thin fontface-crimson pl-24">
          {heading}
        </h1>
        <div className="py-8 container mx-auto">
          <HorizontalDivider />
        </div>
      </div>

      {/* <CollectionInfo heading={heading} subheading={`${items.length} pieces`} /> */}
      <ScrollableLayout>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="flex items-start gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }} // SKELETON OPACITY - Lower for subtler loading state
              exit={{ opacity: 0 }}
              // SKELETON FADE DURATION
              // Controls how long skeletons take to appear/disappear
              // Longer duration = smoother transition but longer wait
              transition={{ duration: 3.6 }}
            >
              {/* SKELETON COUNT
                  Controls how many skeleton items to show
                  Adjust based on typical viewport width */}
              {Array.from({ length: Math.min(items.length, 5) }).map(
                (_, index) => (
                  <ArtworkPaginationItemSkeleton key={index} />
                )
              )}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="flex items-start gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // CONTAINER FADE-IN DURATION & EASING
              // Controls how quickly the entire container fades in
              // Longer duration = more elegant, slower appearance
              // The easing curve [0.22, 1, 0.36, 1] is similar to CSS ease-out-cubic
              // For more dramatic effect, try [0.16, 1, 0.3, 1]
              // For more subtle effect, try [0.33, 1, 0.68, 1]
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {items.map((artwork, index) => (
                <motion.div
                  key={artwork._id}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: visibleItems.includes(index) ? 1 : 0,
                    // Optional: Add subtle movement for more elegant appearance
                    // y: visibleItems.includes(index) ? 0 : 10, // Slides up
                    // scale: visibleItems.includes(index) ? 1 : 0.98, // Subtle grow
                  }}
                  // INDIVIDUAL ITEM ANIMATION
                  // Controls how each artwork fades in
                  // Longer duration = more elegant fade
                  // Different easing = different feel
                  transition={{
                    duration: 1.5, // seconds
                    ease: [0.22, 1, 0.36, 1],
                    // Optional: Add delay based on index for subtle staggering
                    // delay: index * 0.05, // Uncomment for subtle left-to-right effect
                  }}
                >
                  <ArtworkPaginationItem
                    secure_url={artwork.image.secure_url}
                    height={artwork.image.pixelHeight}
                    width={artwork.image.pixelWidth}
                    link_to={artwork.link}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollableLayout>
    </>
  );
}

export const ScrollablePaginationSkeleton = () => {
  return (
    <div className="flex items-start justify-start pl-4 gap-8 overflow-x-auto min-h-[400px]">
      {Array.from({ length: 8 }).map((_, index) => (
        <ArtworkPaginationItemSkeleton key={index} />
      ))}
    </div>
  );
};
