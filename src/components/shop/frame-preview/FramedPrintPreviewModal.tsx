"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FramedArtworkPreview } from "./FramedArtworkPreview";
import { FrameMaterialControls } from "./FrameMaterialControls";
import { FRAME_PROFILES } from "@/lib/framePreview/frameProfiles";
import {
  DEFAULT_MAT_PROFILE_ID,
  getMatProfileById,
} from "@/lib/framePreview/matProfiles";
import type {
  ArtworkDisplayMetrics,
  FrameRenderMode,
  FramePreviewBounds,
  FrameProfile,
  MatProfile,
} from "@/lib/framePreview/types";

type FramedPrintPreviewArtwork = {
  src: string;
  alt: string;
  metrics: ArtworkDisplayMetrics;
};

export type FramedPrintPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  artwork: FramedPrintPreviewArtwork;
  frameProfiles?: readonly FrameProfile[];
  initialFrameProfileId?: string;
  matProfile?: MatProfile;
  bounds?: FramePreviewBounds;
  renderMode?: FrameRenderMode;
  title?: string;
};

const DEFAULT_MODAL_BOUNDS: FramePreviewBounds = {
  maxWidthPx: 720,
  maxHeightPx: 560,
};

const fallbackMatProfile = (): MatProfile => {
  const profile = getMatProfileById(DEFAULT_MAT_PROFILE_ID);

  if (!profile) {
    throw new Error("Default mat profile is missing.");
  }

  return profile;
};

const getInitialFrameProfileId = (
  frameProfiles: readonly FrameProfile[],
  initialFrameProfileId?: string
): string => {
  const initialProfile = frameProfiles.find(
    (profile) => profile.id === initialFrameProfileId
  );

  return initialProfile?.id ?? frameProfiles[0]?.id ?? "";
};

const getFrameProfileIndex = (
  frameProfiles: readonly FrameProfile[],
  selectedFrameProfileId: string
): number => {
  return Math.max(
    0,
    frameProfiles.findIndex((profile) => profile.id === selectedFrameProfileId)
  );
};

export const FramedPrintPreviewModal = ({
  isOpen,
  onClose,
  artwork,
  frameProfiles = FRAME_PROFILES,
  initialFrameProfileId,
  matProfile = fallbackMatProfile(),
  bounds = DEFAULT_MODAL_BOUNDS,
  renderMode = "simple",
  title = "Frame Preview",
}: FramedPrintPreviewModalProps) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedFrameProfileId, setSelectedFrameProfileId] = useState(() =>
    getInitialFrameProfileId(frameProfiles, initialFrameProfileId)
  );

  useEffect(() => {
    setSelectedFrameProfileId(
      getInitialFrameProfileId(frameProfiles, initialFrameProfileId)
    );
  }, [frameProfiles, initialFrameProfileId]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const selectedFrameProfile = useMemo(() => {
    return frameProfiles.find(
      (profile) => profile.id === selectedFrameProfileId
    );
  }, [frameProfiles, selectedFrameProfileId]);

  if (!isOpen || frameProfiles.length === 0 || !selectedFrameProfile) {
    return null;
  }

  const selectByOffset = (offset: number) => {
    const currentIndex = getFrameProfileIndex(
      frameProfiles,
      selectedFrameProfile.id
    );
    const nextIndex =
      (currentIndex + offset + frameProfiles.length) % frameProfiles.length;

    setSelectedFrameProfileId(frameProfiles[nextIndex].id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col gap-5 overflow-auto rounded bg-white p-5 text-gray-950 shadow-2xl sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close frame preview"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xl leading-none transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex justify-center">
          <FramedArtworkPreview
            artwork={artwork}
            frameProfile={selectedFrameProfile}
            matProfile={matProfile}
            bounds={bounds}
            renderMode={renderMode}
            className="flex justify-center"
          />
        </div>

        <FrameMaterialControls
          frameProfiles={frameProfiles}
          selectedFrameProfileId={selectedFrameProfile.id}
          onSelectFrameProfile={setSelectedFrameProfileId}
          onPrevious={() => selectByOffset(-1)}
          onNext={() => selectByOffset(1)}
        />
      </section>
    </div>
  );
};
