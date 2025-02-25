"use client";

import React, { ReactNode, useRef } from "react";
import {
  ArtworkPaginationItem,
  ArtworkPaginationItemSkeleton,
} from "./ArtworkPaginationItem";
import CollectionInfo from "../wip/CollectionInfo";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildUrl } from "@/lib/utils/buildUrl";

interface ScrollablePaginationProps {
  items: (ArtworkNavFields & { link: string })[];
  heading: string;
}

const ScrollableLayout = ({ children }: { children: ReactNode }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = React.useState(false);
  const [showRightButton, setShowRightButton] = React.useState(true);

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

  React.useEffect(() => {
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
    <div className="relative w-full group">
      {showLeftButton && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-2 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex items-start justify-start pl-4 gap-12 overflow-x-auto scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>

      {showRightButton && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-2 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export function ScrollableArtworkPagination({
  items,
  heading,
}: ScrollablePaginationProps) {
  return (
    <>
      <CollectionInfo heading={heading} subheading={`${items.length} pieces`} />
      <ScrollableLayout>
        {items.map((artwork) => (
          <ArtworkPaginationItem
            key={artwork._id}
            secure_url={artwork.image.secure_url}
            height={artwork.image.pixelHeight}
            width={artwork.image.pixelWidth}
            link_to={artwork.link}
          />
        ))}
      </ScrollableLayout>
    </>
  );
}

export const ScrollablePaginationSkeleton = () => {
  return (
    <div className="flex items-start justify-start pl-4 gap-8">
      <ArtworkPaginationItemSkeleton />
    </div>
  );
};
