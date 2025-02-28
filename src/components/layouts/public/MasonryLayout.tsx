import { PublicArtwork } from "@/lib/transforms/artworkToPublic";
import Image from "next/image";
import Link from "next/link";

interface ArtworkLayoutProps {
  artworks: PublicArtwork[];
  next?: string | null;
  prev?: string | null;
}

export const MasonryLayout = ({ artworks }: ArtworkLayoutProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {artworks.map((artwork) => (
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
                  <div className="flex flex-wrap gap-2">
                    <span className="text-white/80 text-sm">
                      {artwork.decade}
                    </span>
                    <span className="text-white/80 text-sm">
                      {artwork.medium}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-sm">
                        ♥ {artwork.favouritedCount}
                      </span>
                      <span className="text-white/80 text-sm">
                        👁 {artwork.watchlistCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
