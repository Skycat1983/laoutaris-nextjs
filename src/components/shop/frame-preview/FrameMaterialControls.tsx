"use client";

import type { FrameProfile } from "@/lib/framePreview/types";

type FrameMaterialControlsProps = {
  frameProfiles: readonly FrameProfile[];
  selectedFrameProfileId: string;
  onSelectFrameProfile: (profileId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export const FrameMaterialControls = ({
  frameProfiles,
  selectedFrameProfileId,
  onSelectFrameProfile,
  onPrevious,
  onNext,
}: FrameMaterialControlsProps) => {
  const selectedProfile = frameProfiles.find(
    (profile) => profile.id === selectedFrameProfileId
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-lg leading-none text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          aria-label="Previous frame material"
          onClick={onPrevious}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <p className="min-w-0 flex-1 text-center text-sm font-medium text-gray-900">
          {selectedProfile?.label ?? "Frame preview"}
        </p>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-lg leading-none text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          aria-label="Next frame material"
          onClick={onNext}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2" role="list">
        {frameProfiles.map((profile) => {
          const isSelected = profile.id === selectedFrameProfileId;

          return (
            <button
              key={profile.id}
              type="button"
              aria-label={`Preview ${profile.label} frame`}
              aria-pressed={isSelected}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
                isSelected
                  ? "border-gray-950 ring-2 ring-gray-950 ring-offset-2"
                  : "border-gray-300 hover:border-gray-700"
              }`}
              onClick={() => onSelectFrameProfile(profile.id)}
            >
              <span
                aria-hidden="true"
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ background: profile.previewStyle.outerColor }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
