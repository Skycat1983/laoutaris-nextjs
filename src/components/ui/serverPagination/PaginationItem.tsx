"use client";

import React from "react";
import { ArtworkLink } from "./ServerPagination";
import Image from "next/image";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";

type PaginationItemProps = {
  artworkLink: ArtworkLink;
};

const PaginationItem = ({ artworkLink }: PaginationItemProps) => {
  const segment = useSelectedLayoutSegment();
  console.warn(segment);
  return (
    <div>
      <Image
        src={artworkLink.imageData.secure_url}
        alt="Untitled artwork"
        height={artworkLink.imageData.pixelHeight}
        width={artworkLink.imageData.pixelWidth}
        className="max-h-full w-auto max-w-[90vw] object-contain self-start"
      />
    </div>
  );
};

export default PaginationItem;
