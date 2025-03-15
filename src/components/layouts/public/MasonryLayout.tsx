import { ArtworkFrontend } from "@/lib/data/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";

interface ArtworkLayoutProps {
  artworks: ArtworkFrontend[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
}

export const MasonryLayout = ({
  artworks,
  hasMore,
  onLoadMore,
  isLoading = false,
}: ArtworkLayoutProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "100px",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="container mx-auto p-4">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {artworks.map((artwork, index) => (
          <Link
            href={`/artwork/${artwork._id}`}
            key={artwork._id}
            className="block mb-4 break-inside-avoid group"
          >
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={artwork.image.secure_url.replace(
                  "/upload/",
                  "/upload/w_600,q_auto/"
                )}
                alt={artwork.title}
                width={600}
                height={
                  artwork.image.pixelHeight * (600 / artwork.image.pixelWidth)
                }
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-4 h-full flex flex-col justify-end">
                  <h2 className="text-white text-xl font-bold mb-2">
                    {artwork.title}
                  </h2>
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{
                      backgroundColor: artwork.image.hexColors[0].color,
                    }}
                  >
                    {" "}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-white/80 text-sm">
                      {artwork.decade}
                    </span>
                    <span className="text-white/80 text-sm">
                      {artwork.medium}
                    </span>
                    <span className="text-white/80 text-sm">
                      {artwork.surface}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-sm">
                        ♥ {artwork.favouriteCount}
                      </span>
                      <span className="text-white/80 text-sm">
                        👁 {artwork.watchlistCount}
                      </span>
                      <span className="text-white/80 text-sm">
                        📂 {artwork.collectionCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div ref={observerTarget} className="h-4 w-full">
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
};
