"use client";

import Image from "next/image";
import { CopyIcon } from "@/components/ui/common/icons/CopyIcon";
import type { FrontendArtwork } from "@/lib/types/artworkTypes";

interface ArtworkFeedCardProps {
  artwork: FrontendArtwork;
}

export function ArtworkFeedCard({ artwork }: ArtworkFeedCardProps) {
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(artwork._id);
      console.log("Copied ID:", artwork._id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group w-full p-12">
      <Image
        src={artwork.image.secure_url.replace(
          "/upload/",
          "/upload/w_300,q_auto/"
        )}
        alt={artwork.title}
        width={200}
        height={200}
        className="w-full h-auto shadow-xl"
        loading="lazy"
      />
      <button
        onClick={handleCopyClick}
        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy ID"
      >
        <CopyIcon />
      </button>
    </div>
  );
}
