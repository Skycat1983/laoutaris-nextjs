import type { MatProfile } from "./types";

export const DEFAULT_MAT_PROFILE_ID = "none";

export const MAT_PROFILES = [
  {
    id: "none",
    label: "No Mat",
    color: "transparent",
    fallbackMatRatio: 0,
    minMatPx: 0,
    maxMatPx: 0,
    matWidthCm: 0,
  },
  {
    id: "warm-white",
    label: "Warm White Mat",
    color: "#f7f2e8",
    fallbackMatRatio: 0.09,
    minMatPx: 18,
    maxMatPx: 72,
    matWidthCm: 5,
  },
  {
    id: "gallery-white-wide",
    label: "Wide Gallery Mat",
    color: "#fbfaf6",
    fallbackMatRatio: 0.13,
    minMatPx: 24,
    maxMatPx: 96,
    matWidthCm: 8,
  },
] as const satisfies readonly MatProfile[];

export type MatProfileId = (typeof MAT_PROFILES)[number]["id"];

export const getMatProfileById = (id: string): MatProfile | undefined => {
  return MAT_PROFILES.find((profile) => profile.id === id);
};
