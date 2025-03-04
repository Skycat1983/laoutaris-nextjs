import { ArtStyle, Decade, Medium, Surface } from "@/lib/data/types";

export const DECADES: Decade[] = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
] as const;

export const ART_STYLES: ArtStyle[] = [
  "abstract",
  "semi-abstract",
  "figurative",
] as const;

export const MEDIUMS: Medium[] = [
  "oil",
  "acrylic",
  "paint",
  "watercolour",
  "pastel",
  "pencil",
  "charcoal",
  "ink",
  "sand",
];

export const SURFACES: Surface[] = ["paper", "canvas", "wood", "film"] as const;
