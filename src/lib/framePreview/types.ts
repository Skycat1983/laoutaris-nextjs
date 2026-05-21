export type FrameMaterial =
  | "black-wood"
  | "white-wood"
  | "oak"
  | "walnut"
  | "metal";

export type FrameScaleMode = "relativePreview" | "physicalScalePreview";

export interface FramePreviewStyle {
  outerColor: string;
  innerColor?: string;
  grainColor?: string;
}

export interface FrameProfile {
  id: string;
  label: string;
  material: FrameMaterial;
  previewStyle: FramePreviewStyle;
  fallbackFrameRatio: number;
  minFramePx: number;
  maxFramePx: number;
  widthCm?: number;
  textureAsset?: string;
  shopifyVariantId?: string;
}

export interface MatProfile {
  id: string;
  label: string;
  color: string;
  fallbackMatRatio: number;
  minMatPx: number;
  maxMatPx: number;
  matWidthCm?: number;
}

export interface ArtworkDisplayMetrics {
  pixelWidth: number;
  pixelHeight: number;
  physicalArtworkWidthCm?: number;
  physicalArtworkHeightCm?: number;
  physicalPrintWidthCm?: number;
  physicalPrintHeightCm?: number;
}

export interface FramePreviewBounds {
  maxWidthPx: number;
  maxHeightPx: number;
}

export interface FramePreviewGeometryInput {
  artwork: ArtworkDisplayMetrics;
  frameProfile: FrameProfile;
  matProfile: MatProfile;
  bounds: FramePreviewBounds;
}

export interface FramePreviewRect {
  widthPx: number;
  heightPx: number;
}

export interface FramePreviewThickness {
  widthPx: number;
}

export interface FramePreviewGeometry {
  scaleMode: FrameScaleMode;
  artwork: FramePreviewRect;
  mat: FramePreviewThickness;
  frame: FramePreviewThickness;
  outer: FramePreviewRect;
  artworkAspectRatio: number;
}
