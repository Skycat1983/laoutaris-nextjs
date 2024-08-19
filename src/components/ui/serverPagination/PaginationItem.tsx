"use client";

import React from "react";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";

type PaginationItemProps = {
  artworkLink: {
    id: string;
    imageData: {
      secure_url: string;
      pixelHeight: number;
      pixelWidth: number;
    };
  };
};

const PaginationItem = ({ artworkLink }: PaginationItemProps) => {
  const segment = useSelectedLayoutSegment();
  const isActive = segment === artworkLink.id;
  // console.warn(segment);
  return (
    <div className="h-[400px]">
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
