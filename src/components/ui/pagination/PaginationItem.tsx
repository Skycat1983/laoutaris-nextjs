"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

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

  const containerClassname = isActive
    ? "h-auto w-auto shadow-2xl"
    : "h-auto w-auto";

  const isPortrait = height > width;

  const imageClassname = isPortrait
    ? "h-auto max-w-[200px]  object-contain self-start"
    : "h-auto max-w-[400px]  object-contain self-start";
  return (
    <Link href={link_to}>
      <div className={containerClassname}>
        <Image
          src={secure_url}
          alt="Untitled artwork"
          height={height}
          width={width}
          className={imageClassname}
          // className="h-auto max-w-[200px]  object-contain self-start"
        />
      </div>
    </Link>
  );
};

export default PaginationItem;

{
  /* <div className="h-[200px] lg:h-[400px]">
        <Image
          src={secure_url}
          alt="Untitled artwork"
          height={height}
          width={width}
          className="max-h-full w-auto max-w-[90vw] object-contain self-start"
        />
      </div> */
}
