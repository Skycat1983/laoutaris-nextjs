"use client";

import Image from "next/image";
import { CopyIcon } from "@/components/elements/icons/CopyIcon";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";

interface ArtworkFeedCardProps {
  item: ArtworkFrontend;
}

export function ArtworkFeedCard({ item }: ArtworkFeedCardProps) {
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(item._id);
    } catch {
      // Preserve the existing silent clipboard failure behavior.
    }
  };

  return (
    <div className="relative group w-full p-12">
      <Image
        src={getCloudinaryDeliveryUrl(item.image.secure_url, "card")}
        alt={item.title}
        width={200}
        height={200}
        className="w-full h-auto shadow-xl"
        // loading="lazy"
      />
      <button
        onClick={handleCopyClick}
        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy ID"
      >
        <CopyIcon />
      </button>
      <div className="absolute inset-12 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 gap-2">
        <p className="text-white/80 text-m">{item.title}</p>

        <h2 className="text-white text-xl font-bold">
          {item.medium} on {item.surface}
        </h2>
        <p className="text-white/80 text-sm">{item.decade}</p>
      </div>
    </div>
  );
}
