"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type Props = {
  children: React.ReactNode;
  currentImageIndex: number;
  updateDisplayedImage: (index: number) => void;
  imgCount: number;
};

const ZoomWrapper = ({
  children,
  currentImageIndex,
  imgCount,
  updateDisplayedImage,
}: Props) => {
  return (
    <div className="max-h-[70vh] justify-around lg:justify-self-end flex justify-end lg:px-8">
      <button
        className="text-slate-800/60"
        onClick={() => {
          const newIndex =
            currentImageIndex > 0 ? currentImageIndex - 1 : imgCount - 1;
          updateDisplayedImage(newIndex);
        }}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      {children}

      <button
        className="text-slate-800/60"
        onClick={() => {
          const newIndex = (currentImageIndex + 1) % imgCount;
          updateDisplayedImage(newIndex);
        }}
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ZoomWrapper;
