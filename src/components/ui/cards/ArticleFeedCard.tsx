"use client";

import Image from "next/image";
import { CopyIcon } from "@/components/elements/icons/CopyIcon";
import copy_id from "@/utils/copy_id";
import { FrontendArticleWithArtwork } from "@/lib/types/articleTypes";

interface ArticleFeedCardProps {
  item: FrontendArticleWithArtwork;
}

export function ArticleFeedCard({ item }: ArticleFeedCardProps) {
  const handleCopyId = copy_id();

  return (
    <div className="relative group w-full p-12">
      <div className="relative">
        <Image
          src={item.artwork.image.secure_url.replace(
            "/upload/",
            "/upload/w_300,q_auto/"
          )}
          alt={item.title}
          width={200}
          height={200}
          className="w-full h-auto shadow-xl"
          loading="lazy"
        />
        {/* overlay w gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 gap-2">
          <h2 className="text-white text-xl font-bold">{item.title}</h2>
          <p className="text-white/80 text-m">{item.subtitle}</p>
          <p className="text-white/80 text-sm">{item.summary}</p>
          <p className="text-white/80 text-xs line-clamp-3">{item.text}</p>
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
