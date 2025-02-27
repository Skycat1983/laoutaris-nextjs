"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/shadcn/skeleton";

interface ArtworkPaginationItemProps {
  secure_url: string;
  height: number;
  width: number;
  link_to: string;
}

export const ArtworkPaginationItem = ({
  secure_url,
  height,
  width,
  link_to,
}: ArtworkPaginationItemProps) => {
  const segment = useSelectedLayoutSegment();
  const _id = link_to.split("/").pop();
  const isActive = segment === _id;
  const isPortrait = height > width;

  const containerClassname = `
    relative
    h-[400px] 
    w-auto 
    transition-all
    duration-500
    ease-in-out
    origin-top
    ${isActive ? "z-10" : ""}
  `;

  const imageWrapperClassName = `
    overflow-visible
    transform-gpu
    transition-all
    bg-white
    duration-500
    ease-in-out
    origin-top
    ${isPortrait ? "w-[200px]" : "w-[400px]"}
    ${isActive ? "scale-110 opacity-100 shadow-2xl" : "hover:scale-105"}
  `;

  const imageClassname = isPortrait
    ? "h-auto max-w-[200px] object-contain self-start"
    : "h-auto max-w-[400px] object-contain self-start";

  return (
    <Link href={link_to}>
      <div className={containerClassname}>
        <div className={imageWrapperClassName}>
          <Image
            src={secure_url}
            alt="Artwork"
            height={height}
            width={width}
            className={imageClassname}
            loading="eager"
            priority={true}
          />
        </div>
      </div>
    </Link>
  );
};

export const ArtworkPaginationItemSkeleton = () => {
  return (
    <div className="bg-gray-400">
      <Skeleton className=" rounded-sm h-[250px] w-[200px]" />
    </div>
  );
};
