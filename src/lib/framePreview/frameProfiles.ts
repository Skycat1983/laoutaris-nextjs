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
