"use client";

import Image from "next/image";
import { CopyIcon } from "@/components/elements/icons/CopyIcon";
import { copy_id } from "@/lib/helpers/copy_id";
import type { BlogEntryFrontend } from "@/lib/data/types";
import { getCloudinaryDeliveryUrl } from "@/lib/images/cloudinaryDelivery";

interface BlogFeedCardProps {
  item: BlogEntryFrontend;
}

export function BlogFeedCard({ item }: BlogFeedCardProps) {
  const handleCopyId = copy_id();

  return (
    <div className="relative group w-full p-12">
      <div className="relative">
        <Image
          src={getCloudinaryDeliveryUrl(item.imageUrl, "card")}
          alt={item.title}
          width={200}
          height={200}
          className="w-full h-auto shadow-xl"
          // loading="lazy"
        />
        {/* Overlay with gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <h2 className="text-white text-xl font-bold">{item.title}</h2>
          <p className="text-white/80 text-sm">{item.subtitle}</p>
          <p className="text-white text-sm font-bold">
            Comments: <span className="text-white/80">{item.commentCount}</span>
          </p>
        </div>
      </div>
      <button
        onClick={() => handleCopyId(item)}
        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy ID"
      >
        <CopyIcon />
      </button>
    </div>
  );
}

export function BlogFeedCardSkeleton() {
  return <div className="w-full h-32 bg-gray-200 animate-pulse rounded-lg" />;
}
