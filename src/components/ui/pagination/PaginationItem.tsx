"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Skeleton } from "../shadcn/skeleton";

interface PaginationArtworkLink {
  secure_url: string;
  height: number;
  width: number;
  link_to: string;
}

const PaginationItem = ({
  secure_url,
  height,
  width,
  link_to,
}: PaginationArtworkLink) => {
  const segment = useSelectedLayoutSegment();
  const _id = link_to.split("/").pop();

  const isActive = segment === _id;
  if (isActive) console.warn("active", segment);
  return (
    <Link href={link_to}>
      <div className="h-auto w-[200px] ">
        <Image
          src={secure_url}
          alt="Untitled artwork"
          height={height}
          width={width}
          className="h-auto max-w-[200px]  object-contain self-start"
        />
      </div>
      {/* <div className="h-[200px] lg:h-[400px]">
        <Image
          src={secure_url}
          alt="Untitled artwork"
          height={height}
          width={width}
          className="max-h-full w-auto max-w-[90vw] object-contain self-start"
        />
      </div> */}
    </Link>
  );
};

export default PaginationItem;
