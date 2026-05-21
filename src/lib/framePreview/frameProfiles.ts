import type { FrameProfile } from "./types";

export const DEFAULT_FRAME_PROFILE_ID = "black-wood-thin";

export const FRAME_PROFILES = [
  {
    id: "black-wood-thin",
    label: "Black Wood",
    material: "black-wood",
    previewStyle: {
      outerColor: "#171717",
      innerColor: "#2a2a2a",
      grainColor: "#3a3a3a",
      highlightColor: "rgba(255,255,255,0.18)",
      shadowColor: "rgba(0,0,0,0.45)",
      seamColor: "rgba(255,255,255,0.16)",
      textureKind: "wood-grain",
    },
    fallbackFrameRatio: 0.035,
    minFramePx: 10,
    maxFramePx: 30,
    widthCm: 2.5,
  },
  {
    id: "white-wood-thin",
    label: "White Wood",
    material: "white-wood",
    previewStyle: {
      outerColor: "#f5f1e8",
      innerColor: "#fffaf0",
      grainColor: "#ded6c8",
      highlightColor: "rgba(255,255,255,0.82)",
      shadowColor: "rgba(74,62,48,0.2)",
      seamColor: "rgba(108,95,78,0.28)",
      textureKind: "painted-grain",
    },
    fallbackFrameRatio: 0.035,
    minFramePx: 10,
    maxFramePx: 30,
    widthCm: 2.5,
  },
  {
    id: "natural-oak-medium",
    label: "Natural Oak",
    material: "oak",
    previewStyle: {
      outerColor: "#c99b5b",
      innerColor: "#d8b579",
      grainColor: "#9f743f",
      highlightColor: "rgba(255,245,214,0.48)",
      shadowColor: "rgba(82,48,18,0.35)",
      seamColor: "rgba(92,54,20,0.35)",
      textureKind: "wood-grain",
    },
    fallbackFrameRatio: 0.045,
    minFramePx: 12,
    maxFramePx: 36,
    widthCm: 3.2,
  },
  {
    id: "walnut-medium",
    label: "Walnut",
    material: "walnut",
    previewStyle: {
      outerColor: "#5b3822",
      innerColor: "#70482d",
      grainColor: "#2f1c12",
      highlightColor: "rgba(255,219,168,0.24)",
      shadowColor: "rgba(18,10,5,0.46)",
      seamColor: "rgba(17,9,5,0.4)",
      textureKind: "wood-grain",
    },
    fallbackFrameRatio: 0.05,
    minFramePx: 14,
    maxFramePx: 42,
    widthCm: 4,
  },
  {
    id: "brushed-metal-narrow",
    label: "Brushed Metal",
    material: "metal",
    previewStyle: {
      outerColor: "#8b8f91",
      innerColor: "#b5b9bb",
      grainColor: "#666a6c",
      highlightColor: "rgba(255,255,255,0.42)",
      shadowColor: "rgba(35,38,40,0.3)",
      seamColor: "rgba(32,34,36,0.32)",
      textureKind: "brushed-metal",
    },
    fallbackFrameRatio: 0.025,
    minFramePx: 8,
    maxFramePx: 24,
    widthCm: 1.8,
  },
] as const satisfies readonly FrameProfile[];

export type FrameProfileId = (typeof FRAME_PROFILES)[number]["id"];

export const getFrameProfileById = (
  id: string
): FrameProfile | undefined => {
  return FRAME_PROFILES.find((profile) => profile.id === id);
};
