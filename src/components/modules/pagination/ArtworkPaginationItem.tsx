"use client";

import { Skeleton } from "@/components/shadcn/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

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

  const imageClassname = `
    w-full
    h-auto
    object-contain
  `;

  return (
    <Link href={link_to}>
      <div className={containerClassname}>
        <div className={imageWrapperClassName}>
          <Image
            src={secure_url}
            alt="Untitled artwork"
            height={height}
            width={width}
            className={imageClassname}
          />
        </div>
      </div>
    </Link>
  );
};

export const ArtworkPaginationItemSkeleton = () => {
  return (
    <div className="h-auto w-auto shadow-2xl">
      <Skeleton className="h-auto w-auto" />
    </div>
  );
};
