import type { FrameProfile, MatProfile } from "./types";

export type FramePreviewRoomScene = {
  id: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
};

export type RoomShadowSettings = {
  rightOffsetPx: number;
  bottomOffsetPx: number;
  sharpnessPx: number;
  diffusionPx: number;
  spreadPx: number;
  opacityPercent: number;
};

export type RoomShadowStyle = {
  frameShadow: {
    boxShadow: string;
    filter: string;
  };
  cornerShadow: {
    width: string;
    height: string;
    background: string;
    filter: string;
    transform: string;
  };
};

export const FRAME_ROOM_SCENES = [
  {
    id: "modern-gallery",
    label: "Modern Gallery",
    imageSrc: "/prototypes/frame-backgrounds/modern-gallery-wall.png",
    imageAlt: "Modern white gallery-style living room wall background",
  },
  {
    id: "scandinavian-living",
    label: "Scandinavian White Wall",
    imageSrc: "/prototypes/frame-backgrounds/scandinavian-white-wall.png",
    imageAlt: "Bright Scandinavian living room with a white wall background",
  },
  {
    id: "townhouse-study",
    label: "Townhouse Study",
    imageSrc: "/prototypes/frame-backgrounds/townhouse-study-wall.png",
    imageAlt: "Older townhouse study wall background",
  },
  {
    id: "plaster-hallway",
    label: "White Plaster Hallway",
    imageSrc: "/prototypes/frame-backgrounds/white-plaster-hallway-wall.png",
    imageAlt: "Bright white plaster hallway wall background",
  },
  {
    id: "minimal-gallery-alcove",
    label: "Minimal Gallery Alcove",
    imageSrc: "/prototypes/frame-backgrounds/minimal-gallery-alcove-wall.png",
    imageAlt: "Minimal contemporary gallery alcove with a white wall background",
  },
  {
    id: "bright-loft",
    label: "Bright Loft",
    imageSrc: "/prototypes/frame-backgrounds/bright-loft-wall.png",
    imageAlt: "Bright modern loft with a white wall background",
  },
  {
    id: "white-bedroom",
    label: "White Bedroom",
    imageSrc: "/prototypes/frame-backgrounds/white-bedroom-wall.png",
    imageAlt: "Calm white bedroom wall background",
  },
  {
    id: "townhouse-sitting",
    label: "White Townhouse Sitting Room",
    imageSrc: "/prototypes/frame-backgrounds/white-townhouse-sitting-wall.png",
    imageAlt: "Elegant white townhouse sitting room wall background",
  },
  {
    id: "artist-studio",
    label: "Artist Studio Wall",
    imageSrc: "/prototypes/frame-backgrounds/artist-studio-white-wall.png",
    imageAlt: "Bright artist studio with a white wall background",
  },
] as const satisfies readonly FramePreviewRoomScene[];

export const SHOP_PRODUCT_ROOM_SCENES = FRAME_ROOM_SCENES.slice(0, 4);

export const ROOM_HANGING_ZONE = {
  leftPercent: 50,
  topPercent: 40,
  widthPercent: 38,
} as const;

export const ROOM_PREVIEW_SCALE = 0.49;

export const DEFAULT_ROOM_SHADOW_SETTINGS: RoomShadowSettings = {
  rightOffsetPx: 6,
  bottomOffsetPx: 6,
  sharpnessPx: 6,
  diffusionPx: 10,
  spreadPx: -1,
  opacityPercent: 28,
};

export const scaleFrameProfileForRoom = (
  profile: FrameProfile,
  scale = ROOM_PREVIEW_SCALE
): FrameProfile => ({
  ...profile,
  minFramePx: profile.minFramePx * scale,
  maxFramePx: profile.maxFramePx * scale,
});

export const scaleMatProfileForRoom = (
  profile: MatProfile,
  scale = ROOM_PREVIEW_SCALE
): MatProfile => ({
  ...profile,
  minMatPx: profile.minMatPx * scale,
  maxMatPx: profile.maxMatPx * scale,
});

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const getFiniteNumber = (value: number, fallback: number): number => {
  return Number.isFinite(value) ? value : fallback;
};

export const getRoomShadowStyle = (
  settings: RoomShadowSettings = DEFAULT_ROOM_SHADOW_SETTINGS
): RoomShadowStyle => {
  const rightOffset = Math.abs(getFiniteNumber(settings.rightOffsetPx, 0));
  const bottomOffset = Math.abs(getFiniteNumber(settings.bottomOffsetPx, 0));
  const sharpness = Math.max(0, getFiniteNumber(settings.sharpnessPx, 0));
  const diffusion = Math.max(0, getFiniteNumber(settings.diffusionPx, 0));
  const spread = getFiniteNumber(settings.spreadPx, 0);
  const opacity = clamp(
    getFiniteNumber(settings.opacityPercent, 0) / 100,
    0,
    1
  );
  const castOpacity = Math.round(opacity * 1000) / 1000;
  const diffuseOpacity = Math.round(opacity * 0.55 * 1000) / 1000;
  const cornerLength = Math.max(
    10,
    Math.hypot(Math.max(rightOffset, bottomOffset * 0.55), bottomOffset)
  );
  const rawCornerAngle =
    rightOffset === 0 && bottomOffset === 0
      ? 45
      : Math.atan2(bottomOffset, Math.max(rightOffset, 0.001)) * (180 / Math.PI);
  const cornerAngle = clamp(rawCornerAngle, 28, 64);

  return {
    frameShadow: {
      boxShadow: `${rightOffset}px ${bottomOffset}px ${sharpness}px ${spread}px rgba(0, 0, 0, ${castOpacity})`,
      filter: `drop-shadow(${rightOffset}px ${bottomOffset}px ${diffusion}px rgba(0, 0, 0, ${diffuseOpacity}))`,
    },
    cornerShadow: {
      width: `${cornerLength}px`,
      height: `${Math.max(1, Math.min(8, sharpness * 0.42 + 1))}px`,
      background: `linear-gradient(90deg, rgba(0, 0, 0, ${castOpacity}) 0%, rgba(0, 0, 0, ${diffuseOpacity}) 56%, rgba(0, 0, 0, 0) 100%)`,
      filter: `blur(${Math.max(0, diffusion * 0.16)}px)`,
      transform: `rotate(${cornerAngle}deg)`,
    },
  };
};
