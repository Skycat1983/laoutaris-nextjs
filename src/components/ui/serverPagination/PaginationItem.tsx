"use client";

import React from "react";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";

type PaginationItemProps = {
  artworkLink: {
    _id: string;
    image: {
      secure_url: string;
      pixelHeight: number;
      pixelWidth: number;
    };
  };
};

const PaginationItem = ({ artworkLink }: PaginationItemProps) => {
  const segment = useSelectedLayoutSegment();
  const isActive = segment === artworkLink._id;
  // console.warn(segment);
  return (
    <div className="h-[200px] lg:h-[400px]">
      <Image
        src={artworkLink.image.secure_url}
        alt="Untitled artwork"
        height={artworkLink.image.pixelHeight}
        width={artworkLink.image.pixelWidth}
        className="max-h-full w-auto max-w-[90vw] object-contain self-start"
      />
    </div>
  );
};

export default PaginationItem;
