import type {
  ArtworkDisplayMetrics,
  FramePreviewGeometry,
  FramePreviewGeometryInput,
  FramePreviewRect,
  FrameProfile,
  FrameScaleMode,
  MatProfile,
} from "./types";

const BINARY_SEARCH_STEPS = 32;
const PHYSICAL_ASPECT_RATIO_TOLERANCE = 0.03;
const PRECISION = 1000;

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

const isPositiveNumber = (value: unknown): value is number => {
  return isFiniteNumber(value) && value > 0;
};

const isNonNegativeNumber = (value: unknown): value is number => {
  return isFiniteNumber(value) && value >= 0;
};

const roundPx = (value: number): number => {
  return Math.round(value * PRECISION) / PRECISION;
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const assertPositive = (value: unknown, label: string): number => {
  if (!isPositiveNumber(value)) {
    throw new RangeError(`${label} must be a positive finite number.`);
  }

  return value;
};

const assertNonNegative = (value: unknown, label: string): number => {
  if (!isNonNegativeNumber(value)) {
    throw new RangeError(`${label} must be a non-negative finite number.`);
  }

  return value;
};

const assertRatio = (value: unknown, label: string): number => {
  const ratio = assertNonNegative(value, label);

  if (ratio > 1) {
    throw new RangeError(`${label} must be less than or equal to 1.`);
  }

  return ratio;
};

const assertClampRange = (min: number, max: number, label: string): void => {
  if (min > max) {
    throw new RangeError(`${label} min cannot be greater than max.`);
  }
};

const getAspectRatio = (metrics: ArtworkDisplayMetrics): number => {
  return metrics.pixelWidth / metrics.pixelHeight;
};

const hasMatchingPrintAspectRatio = (
  metrics: ArtworkDisplayMetrics
): boolean => {
  if (
    !isPositiveNumber(metrics.physicalPrintWidthCm) ||
    !isPositiveNumber(metrics.physicalPrintHeightCm)
  ) {
    return false;
  }

  const pixelAspectRatio = getAspectRatio(metrics);
  const physicalAspectRatio =
    metrics.physicalPrintWidthCm / metrics.physicalPrintHeightCm;
  const ratioDelta =
    Math.abs(pixelAspectRatio - physicalAspectRatio) / pixelAspectRatio;

  return ratioDelta <= PHYSICAL_ASPECT_RATIO_TOLERANCE;
};

const hasPhysicalThicknessData = (
  frameProfile: FrameProfile,
  matProfile: MatProfile
): boolean => {
  const frameHasWidth = isPositiveNumber(frameProfile.widthCm);
  const matRequiresWidth =
    matProfile.fallbackMatRatio > 0 || matProfile.minMatPx > 0;
  const matHasWidth =
    !matRequiresWidth || isPositiveNumber(matProfile.matWidthCm);

  return frameHasWidth && matHasWidth;
};

export const getFrameScaleMode = (
  artwork: ArtworkDisplayMetrics,
  frameProfile: FrameProfile,
  matProfile: MatProfile
): FrameScaleMode => {
  return hasMatchingPrintAspectRatio(artwork) &&
    hasPhysicalThicknessData(frameProfile, matProfile)
    ? "physicalScalePreview"
    : "relativePreview";
};

const validateArtworkMetrics = (artwork: ArtworkDisplayMetrics): void => {
  assertPositive(artwork.pixelWidth, "artwork.pixelWidth");
  assertPositive(artwork.pixelHeight, "artwork.pixelHeight");
};

const validateFrameProfile = (frameProfile: FrameProfile): void => {
  assertRatio(frameProfile.fallbackFrameRatio, "frameProfile.fallbackFrameRatio");
  const minFramePx = assertNonNegative(
    frameProfile.minFramePx,
    "frameProfile.minFramePx"
  );
  const maxFramePx = assertNonNegative(
    frameProfile.maxFramePx,
    "frameProfile.maxFramePx"
  );

  assertClampRange(minFramePx, maxFramePx, "frameProfile");

  if (
    frameProfile.widthCm !== undefined &&
    !isPositiveNumber(frameProfile.widthCm)
  ) {
    throw new RangeError(
      "frameProfile.widthCm must be a positive finite number when provided."
    );
  }
};

const validateMatProfile = (matProfile: MatProfile): void => {
  assertRatio(matProfile.fallbackMatRatio, "matProfile.fallbackMatRatio");
  const minMatPx = assertNonNegative(matProfile.minMatPx, "matProfile.minMatPx");
  const maxMatPx = assertNonNegative(matProfile.maxMatPx, "matProfile.maxMatPx");

  assertClampRange(minMatPx, maxMatPx, "matProfile");

  if (
    matProfile.matWidthCm !== undefined &&
    !isNonNegativeNumber(matProfile.matWidthCm)
  ) {
    throw new RangeError(
      "matProfile.matWidthCm must be a non-negative finite number when provided."
    );
  }
};

const validateInput = (input: FramePreviewGeometryInput): void => {
  validateArtworkMetrics(input.artwork);
  validateFrameProfile(input.frameProfile);
  validateMatProfile(input.matProfile);
  assertPositive(input.bounds.maxWidthPx, "bounds.maxWidthPx");
  assertPositive(input.bounds.maxHeightPx, "bounds.maxHeightPx");
};

const getRelativeThickness = (
  renderedArtwork: FramePreviewRect,
  ratio: number,
  minPx: number,
  maxPx: number
): number => {
  const shortSide = Math.min(renderedArtwork.widthPx, renderedArtwork.heightPx);

  return clamp(shortSide * ratio, minPx, maxPx);
};

const getPhysicalThickness = (
  renderedArtwork: FramePreviewRect,
  physicalPrintWidthCm: number,
  physicalWidthCm: number
): number => {
  return (renderedArtwork.widthPx / physicalPrintWidthCm) * physicalWidthCm;
};

const getThicknesses = (
  renderedArtwork: FramePreviewRect,
  input: FramePreviewGeometryInput,
  scaleMode: FrameScaleMode
): { frameWidthPx: number; matWidthPx: number } => {
  if (
    scaleMode === "physicalScalePreview" &&
    isPositiveNumber(input.artwork.physicalPrintWidthCm) &&
    isPositiveNumber(input.frameProfile.widthCm)
  ) {
    const frameWidthPx = getPhysicalThickness(
      renderedArtwork,
      input.artwork.physicalPrintWidthCm,
      input.frameProfile.widthCm
    );
    const matWidthPx = isPositiveNumber(input.matProfile.matWidthCm)
      ? getPhysicalThickness(
          renderedArtwork,
          input.artwork.physicalPrintWidthCm,
          input.matProfile.matWidthCm
        )
      : 0;

    return { frameWidthPx, matWidthPx };
  }

  return {
    frameWidthPx: getRelativeThickness(
      renderedArtwork,
      input.frameProfile.fallbackFrameRatio,
      input.frameProfile.minFramePx,
      input.frameProfile.maxFramePx
    ),
    matWidthPx: getRelativeThickness(
      renderedArtwork,
      input.matProfile.fallbackMatRatio,
      input.matProfile.minMatPx,
      input.matProfile.maxMatPx
    ),
  };
};

const getRenderedArtworkAtScale = (
  artwork: ArtworkDisplayMetrics,
  scale: number
): FramePreviewRect => {
  return {
    widthPx: artwork.pixelWidth * scale,
    heightPx: artwork.pixelHeight * scale,
  };
};

const getOuterRect = (
  renderedArtwork: FramePreviewRect,
  frameWidthPx: number,
  matWidthPx: number
): FramePreviewRect => {
  const surroundWidth = (frameWidthPx + matWidthPx) * 2;

  return {
    widthPx: renderedArtwork.widthPx + surroundWidth,
    heightPx: renderedArtwork.heightPx + surroundWidth,
  };
};

const fitsBounds = (
  rect: FramePreviewRect,
  maxWidthPx: number,
  maxHeightPx: number
): boolean => {
  return rect.widthPx <= maxWidthPx && rect.heightPx <= maxHeightPx;
};

const calculateAtScale = (
  input: FramePreviewGeometryInput,
  scaleMode: FrameScaleMode,
  scale: number
) => {
  const artwork = getRenderedArtworkAtScale(input.artwork, scale);
  const { frameWidthPx, matWidthPx } = getThicknesses(
    artwork,
    input,
    scaleMode
  );
  const outer = getOuterRect(artwork, frameWidthPx, matWidthPx);

  return {
    artwork,
    frameWidthPx,
    matWidthPx,
    outer,
  };
};

export const calculateFramePreviewGeometry = (
  input: FramePreviewGeometryInput
): FramePreviewGeometry => {
  validateInput(input);

  const scaleMode = getFrameScaleMode(
    input.artwork,
    input.frameProfile,
    input.matProfile
  );
  const maxScale = Math.min(
    input.bounds.maxWidthPx / input.artwork.pixelWidth,
    input.bounds.maxHeightPx / input.artwork.pixelHeight
  );
  let low = 0;
  let high = maxScale;

  for (let index = 0; index < BINARY_SEARCH_STEPS; index += 1) {
    const nextScale = (low + high) / 2;
    const nextGeometry = calculateAtScale(input, scaleMode, nextScale);

    if (
      fitsBounds(
        nextGeometry.outer,
        input.bounds.maxWidthPx,
        input.bounds.maxHeightPx
      )
    ) {
      low = nextScale;
    } else {
      high = nextScale;
    }
  }

  return finalizeGeometry(
    input,
    scaleMode,
    calculateAtScale(input, scaleMode, low)
  );
};

export const calculateFixedArtworkFramePreviewGeometry = (
  input: FramePreviewGeometryInput
): FramePreviewGeometry => {
  validateInput(input);

  const scaleMode = getFrameScaleMode(
    input.artwork,
    input.frameProfile,
    input.matProfile
  );
  const artworkScale = Math.min(
    input.bounds.maxWidthPx / input.artwork.pixelWidth,
    input.bounds.maxHeightPx / input.artwork.pixelHeight
  );

  return finalizeGeometry(
    input,
    scaleMode,
    calculateAtScale(input, scaleMode, artworkScale)
  );
};

const finalizeGeometry = (
  input: FramePreviewGeometryInput,
  scaleMode: FrameScaleMode,
  geometry: ReturnType<typeof calculateAtScale>
): FramePreviewGeometry => {
  if (geometry.artwork.widthPx < 1 || geometry.artwork.heightPx < 1) {
    throw new RangeError("Preview bounds are too small for the frame preview.");
  }

  const artwork = {
    widthPx: roundPx(geometry.artwork.widthPx),
    heightPx: roundPx(geometry.artwork.heightPx),
  };
  const frameWidthPx = roundPx(geometry.frameWidthPx);
  const matWidthPx = roundPx(geometry.matWidthPx);
  const outer = {
    widthPx: roundPx(geometry.outer.widthPx),
    heightPx: roundPx(geometry.outer.heightPx),
  };

  return {
    scaleMode,
    artwork,
    frame: {
      widthPx: frameWidthPx,
    },
    mat: {
      widthPx: matWidthPx,
    },
    outer,
    artworkAspectRatio: roundPx(getAspectRatio(input.artwork)),
  };
};
