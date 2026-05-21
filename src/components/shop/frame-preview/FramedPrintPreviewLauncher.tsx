"use client";

import { useState } from "react";
import { FramedPrintPreviewModal } from "./FramedPrintPreviewModal";
import { FRAME_PROFILES } from "@/lib/framePreview/frameProfiles";
import { MAT_PROFILES } from "@/lib/framePreview/matProfiles";
import type { FramedPrintPreviewArtwork } from "@/lib/framePreview/productEligibility";

type FramedPrintPreviewLauncherProps = {
  artwork: FramedPrintPreviewArtwork;
};

const productPreviewBounds = {
  maxWidthPx: 760,
  maxHeightPx: 560,
};

export const FramedPrintPreviewLauncher = ({
  artwork,
}: FramedPrintPreviewLauncherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mt-4 w-full rounded-md border border-gray-900 px-8 py-4 text-center font-semibold text-gray-950 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
        onClick={() => setIsOpen(true)}
      >
        Preview Frame Options
      </button>
      <FramedPrintPreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        artwork={artwork}
        frameProfiles={FRAME_PROFILES}
        matProfile={MAT_PROFILES[1]}
        bounds={productPreviewBounds}
        title="Frame Preview"
      />
    </>
  );
};
