"use client";

import { useMemo, useState } from "react";
import { FramedArtworkPreview } from "@/components/shop/frame-preview/FramedArtworkPreview";
import { FramedPrintPreviewModal } from "@/components/shop/frame-preview/FramedPrintPreviewModal";
import { FRAME_PROFILES } from "@/lib/framePreview/frameProfiles";
import { MAT_PROFILES } from "@/lib/framePreview/matProfiles";
import type { ArtworkDisplayMetrics } from "@/lib/framePreview/types";

type PrototypeArtwork = {
  id: string;
  label: string;
  src: string;
  alt: string;
  metrics: ArtworkDisplayMetrics;
};

const PROTOTYPE_ARTWORKS = [
  {
    id: "portrait",
    label: "Portrait",
    src: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg",
    alt: "Portrait artwork frame preview sample",
    metrics: {
      pixelWidth: 1400,
      pixelHeight: 2000,
    },
  },
  {
    id: "landscape",
    label: "Landscape",
    src: "https://res.cloudinary.com/dzncmfirr/image/upload/v1739636066/artwork/lxkuzke740r4flfk8rky.jpg",
    alt: "Landscape artwork frame preview sample",
    metrics: {
      pixelWidth: 3000,
      pixelHeight: 1800,
    },
  },
  {
    id: "square",
    label: "Square",
    src: "https://res.cloudinary.com/dzncmfirr/image/upload/v1741015604/artwork/bnd2xppbo7msrnqogys3.jpg",
    alt: "Square artwork frame preview sample",
    metrics: {
      pixelWidth: 1800,
      pixelHeight: 1800,
    },
  },
  {
    id: "wide",
    label: "Wide",
    src: "https://res.cloudinary.com/dzncmfirr/image/upload/v1707470649/art-thumbnails/JRL_w111_crop_so0ecb.jpg",
    alt: "Wide artwork frame preview sample",
    metrics: {
      pixelWidth: 2500,
      pixelHeight: 1000,
    },
  },
] as const satisfies readonly PrototypeArtwork[];

const previewBounds = {
  maxWidthPx: 520,
  maxHeightPx: 380,
};

const modalBounds = {
  maxWidthPx: 760,
  maxHeightPx: 560,
};

export const FramePreviewPrototype = () => {
  const [selectedArtworkId, setSelectedArtworkId] = useState(
    PROTOTYPE_ARTWORKS[0].id
  );
  const [selectedFrameProfileId, setSelectedFrameProfileId] = useState(
    FRAME_PROFILES[0].id
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedArtwork = useMemo(() => {
    return (
      PROTOTYPE_ARTWORKS.find((artwork) => artwork.id === selectedArtworkId) ??
      PROTOTYPE_ARTWORKS[0]
    );
  }, [selectedArtworkId]);
  const selectedFrameProfile = useMemo(() => {
    return (
      FRAME_PROFILES.find((profile) => profile.id === selectedFrameProfileId) ??
      FRAME_PROFILES[0]
    );
  }, [selectedFrameProfileId]);
  const matProfile = MAT_PROFILES[1];

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
      <section
        className="grid min-h-[calc(100vh-4rem)] gap-8 lg:grid-cols-[minmax(0,1fr),360px]"
        aria-labelledby="frame-prototype-heading"
      >
        <div className="flex min-h-[520px] items-center justify-center bg-white p-5 shadow-sm">
          <FramedArtworkPreview
            artwork={selectedArtwork}
            frameProfile={selectedFrameProfile}
            matProfile={matProfile}
            bounds={previewBounds}
            className="flex justify-center"
          />
        </div>

        <aside className="flex flex-col justify-center gap-8">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gray-500">
              Prototype
            </p>
            <h2
              id="frame-prototype-heading"
              className="text-3xl font-semibold tracking-normal"
            >
              Frame preview
            </h2>
          </div>

          <div className="space-y-3" aria-label="Artwork shape samples">
            <p className="text-sm font-medium text-gray-700">Artwork shape</p>
            <div className="grid grid-cols-2 gap-2">
              {PROTOTYPE_ARTWORKS.map((artwork) => (
                <button
                  key={artwork.id}
                  type="button"
                  aria-pressed={artwork.id === selectedArtwork.id}
                  className={`border px-3 py-3 text-left text-sm transition ${
                    artwork.id === selectedArtwork.id
                      ? "border-gray-950 bg-gray-950 text-white"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-800"
                  }`}
                  onClick={() => setSelectedArtworkId(artwork.id)}
                >
                  {artwork.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3" aria-label="Frame material samples">
            <p className="text-sm font-medium text-gray-700">Frame material</p>
            <div className="grid grid-cols-1 gap-2">
              {FRAME_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  aria-pressed={profile.id === selectedFrameProfile.id}
                  className={`flex items-center gap-3 border px-3 py-3 text-left text-sm transition ${
                    profile.id === selectedFrameProfile.id
                      ? "border-gray-950 bg-white text-gray-950 ring-1 ring-gray-950"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-800"
                  }`}
                  onClick={() => setSelectedFrameProfileId(profile.id)}
                >
                  <span
                    aria-hidden="true"
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{ background: profile.previewStyle.outerColor }}
                  />
                  {profile.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-gray-950 px-5 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
            onClick={() => setIsModalOpen(true)}
          >
            Open modal preview
          </button>
        </aside>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Aspect ratio comparison"
      >
        {PROTOTYPE_ARTWORKS.map((artwork) => (
          <div key={artwork.id} className="bg-white p-4 shadow-sm">
            <FramedArtworkPreview
              artwork={artwork}
              frameProfile={selectedFrameProfile}
              matProfile={MAT_PROFILES[0]}
              bounds={{ maxWidthPx: 320, maxHeightPx: 240 }}
              className="flex justify-center"
            />
            <p className="mt-3 text-center text-sm font-medium text-gray-700">
              {artwork.label}
            </p>
          </div>
        ))}
      </section>

      <FramedPrintPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artwork={selectedArtwork}
        frameProfiles={FRAME_PROFILES}
        initialFrameProfileId={selectedFrameProfile.id}
        matProfile={matProfile}
        bounds={modalBounds}
        title="Frame Preview Prototype"
      />
    </div>
  );
};
