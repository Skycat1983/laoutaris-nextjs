import type { ArtworkFrontend } from "@/lib/data/types";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { LoadingStatus } from "@/components/elements/misc/LoadingStatus";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";

interface ArtworkLayoutProps {
  artworks: ArtworkFrontend[];
  hasMore: boolean;
  onLoadMore: () => Promise<void> | void;
  isLoading?: boolean;
  loadMoreError?: string | null;
  onRetryLoadMore?: () => Promise<void> | void;
}

export const MasonryLayout = ({
  artworks,
  hasMore,
  onLoadMore,
  isLoading = false,
  loadMoreError,
  onRetryLoadMore,
}: ArtworkLayoutProps) => {
  const {
    observerRef,
    isLoading: scrollLoading,
    error,
  } = useInfiniteScroll({
    onLoadMore: async () => {
      await onLoadMore();
    },
    hasMore,
  });

  const loading = isLoading || scrollLoading;
  const visibleError =
    loadMoreError || (error ? "Error loading more artworks" : null);

  return (
    <div className="container mx-auto p-4">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {artworks.map((artwork, index) => (
          <Link
            href={`/artwork/${artwork._id}`}
            key={artwork._id}
            className="block mb-4 break-inside-avoid group"
          >
            <div className="relative overflow-hidden">
              <Image
                src={getCloudinaryDeliveryUrl(
                  artwork.image.secure_url,
                  "galleryList"
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

      <div ref={observerRef} className="h-4 w-full">
        {loading && (
          <LoadingStatus
            label="Loading more artworks"
            className="flex py-4"
            iconClassName="text-gray-900"
          />
        )}
        {visibleError && (
          <div className="flex flex-col items-center gap-3 py-4 text-center text-red-600">
            <p>{visibleError}</p>
            {onRetryLoadMore && (
              <button
                type="button"
                onClick={onRetryLoadMore}
                className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
