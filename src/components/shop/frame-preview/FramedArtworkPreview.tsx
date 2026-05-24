import Image from "next/image";
import {
  calculateFixedArtworkFramePreviewGeometry,
  calculateFramePreviewGeometry,
} from "@/lib/framePreview/geometry";
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
  FrameRenderMode,
  FramePreviewBounds,
  FramePreviewGeometry,
  FrameProfile,
  FrameSizingMode,
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
  renderMode?: FrameRenderMode;
  sizingMode?: FrameSizingMode;
  priority?: boolean;
  unoptimized?: boolean;
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

const railMaterialPanelBackground = (
  profile: FrameProfile,
  axis: "horizontal" | "vertical"
): string => {
  const { grainColor, shadowColor, textureKind } = profile.previewStyle;
  const grain = grainColor ?? profile.previewStyle.outerColor;
  const shadow = shadowColor ?? "rgba(0,0,0,0.28)";
  const lengthAngle = axis === "horizontal" ? "90deg" : "0deg";
  const crossAngle = axis === "horizontal" ? "0deg" : "90deg";
  const base = frameBackground(profile);

  if (textureKind === "brushed-metal") {
    return [
      `linear-gradient(${lengthAngle}, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.06) 18%, rgba(255,255,255,0.18) 39%, rgba(0,0,0,0.08) 63%, ${shadow} 100%)`,
      `linear-gradient(${crossAngle}, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 38%, rgba(0,0,0,0.16) 100%)`,
      base,
    ].join(", ");
  }

  const paintWash =
    textureKind === "painted-grain"
      ? "rgba(255,255,255,0.24)"
      : "rgba(255,255,255,0.12)";
  const grainWash =
    textureKind === "painted-grain" ? "rgba(0,0,0,0.04)" : grain;

  return [
    `linear-gradient(${lengthAngle}, ${paintWash} 0%, rgba(255,255,255,0.04) 22%, ${grainWash} 48%, rgba(255,255,255,0.05) 72%, ${shadow} 100%)`,
    `linear-gradient(${lengthAngle}, rgba(255,255,255,0) 0%, rgba(255,255,255,0.11) 13%, rgba(0,0,0,0.04) 31%, rgba(255,255,255,0.09) 57%, rgba(0,0,0,0.06) 81%, rgba(255,255,255,0) 100%)`,
    `radial-gradient(ellipse at 22% 45%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 34%)`,
    `radial-gradient(ellipse at 78% 58%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 42%)`,
    base,
  ].join(", ");
};

const railBoxShadow = (
  profile: FrameProfile,
  edge: "top" | "right" | "bottom" | "left"
): string => {
  const highlight =
    profile.previewStyle.highlightColor ?? "rgba(255,255,255,0.32)";
  const shadow = profile.previewStyle.shadowColor ?? "rgba(0,0,0,0.32)";

  if (edge === "top") {
    return `inset 0 1px 0 ${highlight}, inset 0 -12px 18px ${shadow}`;
  }

  if (edge === "bottom") {
    return `inset 0 12px 18px ${highlight}, inset 0 -1px 0 ${shadow}`;
  }

  if (edge === "left") {
    return `inset 1px 0 0 ${highlight}, inset -12px 0 18px ${shadow}`;
  }

  return `inset 12px 0 18px ${highlight}, inset -1px 0 0 ${shadow}`;
};

type RailEdge = "top" | "right" | "bottom" | "left";

const railClipPath = (edge: RailEdge, frameWidthPx: number): string => {
  const frameWidth = `${frameWidthPx}px`;

  if (edge === "top") {
    return `polygon(0 0, 100% 0, calc(100% - ${frameWidth}) 100%, ${frameWidth} 100%)`;
  }

  if (edge === "bottom") {
    return `polygon(${frameWidth} 0, calc(100% - ${frameWidth}) 0, 100% 100%, 0 100%)`;
  }

  if (edge === "left") {
    return `polygon(0 0, 100% ${frameWidth}, 100% calc(100% - ${frameWidth}), 0 100%)`;
  }

  return `polygon(0 ${frameWidth}, 100% 0, 100% 100%, 0 calc(100% - ${frameWidth}))`;
};

type FrameRailProps = {
  edge: RailEdge;
  frameProfile: FrameProfile;
  frameWidthPx: number;
};

const FrameRail = ({ edge, frameProfile, frameWidthPx }: FrameRailProps) => {
  const isHorizontal = edge === "top" || edge === "bottom";

  return (
    <div
      aria-hidden="true"
      data-testid={`framed-preview-rail-${edge}`}
      data-frame-texture-kind={frameProfile.previewStyle.textureKind}
      data-frame-texture-mode="panel"
      style={{
        position: "absolute",
        top: edge === "bottom" ? undefined : 0,
        right: edge === "left" ? undefined : 0,
        bottom: edge === "top" ? undefined : 0,
        left: edge === "right" ? undefined : 0,
        width: isHorizontal ? "100%" : frameWidthPx,
        height: isHorizontal ? frameWidthPx : "100%",
        clipPath: railClipPath(edge, frameWidthPx),
        backgroundImage: railMaterialPanelBackground(
          frameProfile,
          isHorizontal ? "horizontal" : "vertical"
        ),
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        boxShadow: railBoxShadow(frameProfile, edge),
      }}
    />
  );
};

type MiterSeamProps = {
  corner: "top-left" | "top-right" | "bottom-right" | "bottom-left";
  frameProfile: FrameProfile;
  frameWidthPx: number;
};

const miterRotation = {
  "top-left": "45deg",
  "top-right": "135deg",
  "bottom-right": "-135deg",
  "bottom-left": "-45deg",
} as const;

const MiterSeam = ({
  corner,
  frameProfile,
  frameWidthPx,
}: MiterSeamProps) => {
  const seamColor = frameProfile.previewStyle.seamColor ?? "rgba(0,0,0,0.24)";
  const seamLength = frameWidthPx * 1.42;

  return (
    <span
      aria-hidden="true"
      data-testid="framed-preview-miter-seam"
      style={{
        position: "absolute",
        top: corner.startsWith("top") ? 0 : undefined,
        right: corner.endsWith("right") ? 0 : undefined,
        bottom: corner.startsWith("bottom") ? 0 : undefined,
        left: corner.endsWith("left") ? 0 : undefined,
        width: seamLength,
        height: Math.max(1, frameWidthPx * 0.035),
        backgroundColor: seamColor,
        opacity: 0.72,
        transform: `rotate(${miterRotation[corner]})`,
        transformOrigin: corner.endsWith("left")
          ? "left center"
          : "right center",
      }}
    />
  );
};

type PreviewContentProps = {
  artwork: FramedArtworkPreviewImage;
  geometry: FramePreviewGeometry;
  matProfile: MatProfile;
  priority: boolean;
  unoptimized: boolean;
};

const PreviewContent = ({
  artwork,
  geometry,
  matProfile,
  priority,
  unoptimized,
}: PreviewContentProps) => {
  const matBackground =
    matProfile.id === DEFAULT_MAT_PROFILE_ID ? "transparent" : matProfile.color;
  const imageWidth = Math.max(1, Math.round(artwork.metrics.pixelWidth));
  const imageHeight = Math.max(1, Math.round(artwork.metrics.pixelHeight));
  const renderedImageWidth = Math.max(1, Math.ceil(geometry.artwork.widthPx));

  return (
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
        unoptimized={unoptimized ? true : undefined}
        sizes={`${renderedImageWidth}px`}
        className="block object-contain"
        style={{
          width: geometry.artwork.widthPx,
          height: geometry.artwork.heightPx,
        }}
      />
    </div>
  );
};

type SimpleFrameRendererProps = {
  artwork: FramedArtworkPreviewImage;
  frameProfile: FrameProfile;
  matProfile: MatProfile;
  geometry: FramePreviewGeometry;
  priority: boolean;
  unoptimized: boolean;
};

const SimpleFrameRenderer = ({
  artwork,
  frameProfile,
  matProfile,
  geometry,
  priority,
  unoptimized,
}: SimpleFrameRendererProps) => (
  <div
    className="shadow-2xl"
    data-testid="framed-preview-frame"
    style={{
      padding: geometry.frame.widthPx,
      background: frameBackground(frameProfile),
    }}
  >
    <PreviewContent
      artwork={artwork}
      geometry={geometry}
      matProfile={matProfile}
      priority={priority}
      unoptimized={unoptimized}
    />
  </div>
);

type RailFrameRendererProps = SimpleFrameRendererProps;

const RailFrameRenderer = ({
  artwork,
  frameProfile,
  matProfile,
  geometry,
  priority,
  unoptimized,
}: RailFrameRendererProps) => {
  const frameWidthPx = geometry.frame.widthPx;

  return (
    <div
      className="shadow-2xl"
      data-testid="framed-preview-frame"
      data-frame-renderer="rails"
      style={{
        position: "relative",
        width: geometry.outer.widthPx,
        height: geometry.outer.heightPx,
        backgroundColor: frameProfile.previewStyle.outerColor,
        overflow: "hidden",
      }}
    >
      <FrameRail
        edge="top"
        frameProfile={frameProfile}
        frameWidthPx={frameWidthPx}
      />
      <FrameRail
        edge="right"
        frameProfile={frameProfile}
        frameWidthPx={frameWidthPx}
      />
      <FrameRail
        edge="bottom"
        frameProfile={frameProfile}
        frameWidthPx={frameWidthPx}
      />
      <FrameRail
        edge="left"
        frameProfile={frameProfile}
        frameWidthPx={frameWidthPx}
      />
      <MiterSeam
        corner="top-left"
        frameProfile={frameProfile}
        frameWidthPx={frameWidthPx}
      />
      <MiterSeam
        corner="top-right"
        frameProfile={frameProfile}
        frameWidthPx={frameWidthPx}
      />
      <MiterSeam
        corner="bottom-right"
        frameProfile={frameProfile}
        frameWidthPx={frameWidthPx}
      />
      <MiterSeam
        corner="bottom-left"
        frameProfile={frameProfile}
        frameWidthPx={frameWidthPx}
      />
      <div
        data-testid="framed-preview-rail-content"
        style={{
          position: "absolute",
          top: frameWidthPx,
          left: frameWidthPx,
          width: geometry.outer.widthPx - frameWidthPx * 2,
          height: geometry.outer.heightPx - frameWidthPx * 2,
          boxShadow: `inset 0 0 18px ${
            frameProfile.previewStyle.shadowColor ?? "rgba(0,0,0,0.32)"
          }`,
        }}
      >
        <PreviewContent
          artwork={artwork}
          geometry={geometry}
          matProfile={matProfile}
          priority={priority}
          unoptimized={unoptimized}
        />
        <span
          aria-hidden="true"
          data-testid="framed-preview-inner-bevel"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            boxShadow: [
              "inset 0 0 0 1px rgba(255,255,255,0.38)",
              "inset 0 0 0 2px rgba(0,0,0,0.08)",
              "inset 0 18px 24px rgba(255,255,255,0.1)",
              "inset 0 -18px 22px rgba(0,0,0,0.12)",
            ].join(", "),
          }}
        />
        <span
          aria-hidden="true"
          data-testid="framed-preview-glass-sheen"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0) 42%)",
            mixBlendMode: "screen",
            opacity: 0.45,
          }}
        />
      </div>
    </div>
  );
};

export const FramedArtworkPreview = ({
  artwork,
  frameProfile = requireFrameProfile(),
  matProfile = requireMatProfile(),
  bounds = DEFAULT_PREVIEW_BOUNDS,
  renderMode = "simple",
  sizingMode = "fitOuter",
  priority = false,
  unoptimized = false,
  className,
}: FramedArtworkPreviewProps) => {
  const geometryInput = {
    artwork: artwork.metrics,
    frameProfile,
    matProfile,
    bounds,
  };
  const geometry =
    sizingMode === "fixedArtwork"
      ? calculateFixedArtworkFramePreviewGeometry(geometryInput)
      : calculateFramePreviewGeometry(geometryInput);

  return (
    <figure
      aria-label={`Framed preview of ${artwork.alt}`}
      className={className}
      data-frame-profile-id={frameProfile.id}
      data-mat-profile-id={matProfile.id}
      data-render-mode={renderMode}
      data-sizing-mode={sizingMode}
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
        {renderMode === "rails" ? (
          <RailFrameRenderer
            artwork={artwork}
            frameProfile={frameProfile}
            matProfile={matProfile}
            geometry={geometry}
            priority={priority}
            unoptimized={unoptimized}
          />
        ) : (
          <SimpleFrameRenderer
            artwork={artwork}
            frameProfile={frameProfile}
            matProfile={matProfile}
            geometry={geometry}
            priority={priority}
            unoptimized={unoptimized}
          />
        )}
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
