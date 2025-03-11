export const DECADE_OPTIONS = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
] as const;
export type Decade = (typeof DECADE_OPTIONS)[number];

export const ARTSTYLE_OPTIONS = [
  "abstract",
  "semi-abstract",
  "figurative",
] as const;
export type ArtStyle = (typeof ARTSTYLE_OPTIONS)[number];

export const MEDIUM_OPTIONS = [
  "oil",
  "acrylic",
  "paint",
  "watercolour",
  "pastel",
  "pencil",
  "charcoal",
  "ink",
  "sand",
] as const;
export type Medium = (typeof MEDIUM_OPTIONS)[number];

export const SURFACE_OPTIONS = ["paper", "canvas", "wood", "film"] as const;
export type Surface = (typeof SURFACE_OPTIONS)[number];

export const FILTER_MODE_OPTIONS = ["ALL", "ANY"] as const;
export type FilterMode = (typeof FILTER_MODE_OPTIONS)[number];

export const FILTER_KEY_OPTIONS = [
  "decade",
  "artstyle",
  "medium",
  "surface",
] as const;
export type FilterKey = (typeof FILTER_KEY_OPTIONS)[number];

export const SORT_OPTION_OPTIONS = [
  "colorProximity",
  "mostRecent",
  "mostPopular",
  "mostFeatured",
] as const;
export type SortOption = (typeof SORT_OPTION_OPTIONS)[number];
