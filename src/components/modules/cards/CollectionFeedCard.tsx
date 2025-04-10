"use client";

import { CollectionFrontend } from "@/lib/data/types";
import { copy_id } from "@/lib/helpers/copy_id";
import Image from "next/image";
import { CopyIcon } from "@/components/elements/icons/CopyIcon";

interface CollectionFeedCardProps {
  item: CollectionFrontend;
}

export function CollectionFeedCard({ item }: CollectionFeedCardProps) {
  const handleCopyId = copy_id();

  return (
    <div className="relative group w-full p-12">
      <div className="relative">
        <Image
          src={item.imageUrl.replace("/upload/", "/upload/w_300,q_auto/")}
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
          <h1 className="text-white text-sm font-bold">
            Artworks: <span className="text-white/80">{item.artworkCount}</span>
          </h1>
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
