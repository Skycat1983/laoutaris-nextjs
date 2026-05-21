import Image from "next/image";
import { calculateFramePreviewGeometry } from "@/lib/framePreview/geometry";
import {
  DEFAULT_FRAME_PROFILE_ID,
  getFrameProfileById,
} from "@/lib/framePreview/frameProfiles";
import {
  DEFAULT_MAT_PROFILE_ID,
  getMatProfileById,
} from "@/lib/framePreview/matProfiles";
import type {
  ArtworkDisplayMetrics,
  FramePreviewBounds,
  FrameProfile,
  MatProfile,
} from "@/lib/framePreview/types";

type FramedArtworkPreviewImage = {
  src: string;
  alt: string;
  metrics: ArtworkDisplayMetrics;
};

export type FramedArtworkPreviewProps = {
  artwork: FramedArtworkPreviewImage;
  frameProfile?: FrameProfile;
  matProfile?: MatProfile;
  bounds?: FramePreviewBounds;
  priority?: boolean;
  className?: string;
};

const DEFAULT_PREVIEW_BOUNDS: FramePreviewBounds = {
  maxWidthPx: 720,
  maxHeightPx: 560,
};

const requireFrameProfile = (): FrameProfile => {
  const profile = getFrameProfileById(DEFAULT_FRAME_PROFILE_ID);

  if (!profile) {
    throw new Error("Default frame profile is missing.");
  }

  return profile;
};

const requireMatProfile = (): MatProfile => {
  const profile = getMatProfileById(DEFAULT_MAT_PROFILE_ID);

  if (!profile) {
    throw new Error("Default mat profile is missing.");
  }

  return profile;
};

const frameBackground = (profile: FrameProfile): string => {
  const { outerColor, innerColor, grainColor } = profile.previewStyle;

  if (!innerColor) {
    return outerColor;
  }

  const accent = grainColor ?? outerColor;

  return `linear-gradient(135deg, ${outerColor} 0%, ${innerColor} 42%, ${accent} 51%, ${innerColor} 60%, ${outerColor} 100%)`;
};

export const FramedArtworkPreview = ({
  artwork,
  frameProfile = requireFrameProfile(),
  matProfile = requireMatProfile(),
  bounds = DEFAULT_PREVIEW_BOUNDS,
  priority = false,
  className,
}: FramedArtworkPreviewProps) => {
  const geometry = calculateFramePreviewGeometry({
    artwork: artwork.metrics,
    frameProfile,
    matProfile,
    bounds,
  });
  const matBackground =
    matProfile.id === DEFAULT_MAT_PROFILE_ID ? "transparent" : matProfile.color;
  const imageWidth = Math.max(1, Math.round(artwork.metrics.pixelWidth));
  const imageHeight = Math.max(1, Math.round(artwork.metrics.pixelHeight));
  const renderedImageWidth = Math.max(1, Math.ceil(geometry.artwork.widthPx));

  return (
    <figure
      aria-label={`Framed preview of ${artwork.alt}`}
      className={className}
      data-frame-profile-id={frameProfile.id}
      data-mat-profile-id={matProfile.id}
      data-scale-mode={geometry.scaleMode}
    >
      <div
        className="inline-flex items-center justify-center"
        data-testid="framed-preview-outer"
        style={{
          width: geometry.outer.widthPx,
          height: geometry.outer.heightPx,
          maxWidth: "100%",
        }}
      >
        <div
          className="shadow-2xl"
          data-testid="framed-preview-frame"
          style={{
            padding: geometry.frame.widthPx,
            background: frameBackground(frameProfile),
          }}
        >
          <div
            data-testid="framed-preview-mat"
            style={{
              padding: geometry.mat.widthPx,
              backgroundColor: matBackground,
            }}
          >
            <Image
              src={artwork.src}
              alt={artwork.alt}
              width={imageWidth}
              height={imageHeight}
              priority={priority ? true : undefined}
              sizes={`${renderedImageWidth}px`}
              className="block object-contain"
              style={{
                width: geometry.artwork.widthPx,
                height: geometry.artwork.heightPx,
              }}
            />
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        {frameProfile.label} frame preview
        {matProfile.id === DEFAULT_MAT_PROFILE_ID
          ? ""
          : ` with ${matProfile.label}`}
      </figcaption>
    </figure>
  );
};
