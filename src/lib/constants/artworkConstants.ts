const DECADE_OPTIONS = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
] as const;
type Decade = (typeof DECADE_OPTIONS)[number];

const ARTSTYLE_OPTIONS = ["abstract", "semi-abstract", "figurative"] as const;
type ArtStyle = (typeof ARTSTYLE_OPTIONS)[number];

const MEDIUM_OPTIONS = [
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
type Medium = (typeof MEDIUM_OPTIONS)[number];

const SURFACE_OPTIONS = ["paper", "canvas", "wood", "film"] as const;
type Surface = (typeof SURFACE_OPTIONS)[number];

const FILTER_MODE_OPTIONS = ["ALL", "ANY"] as const;
type FilterMode = (typeof FILTER_MODE_OPTIONS)[number];

const FILTER_KEY_OPTIONS = ["decade", "artstyle", "medium", "surface"] as const;
type FilterKey = (typeof FILTER_KEY_OPTIONS)[number];

const SORT_OPTION_OPTIONS = [
  "colorProximity",
  "mostRecent",
  "mostPopular",
  "mostFeatured",
] as const;
type SortOption = (typeof SORT_OPTION_OPTIONS)[number];

export type {
  Decade,
  ArtStyle,
  Medium,
  Surface,
  FilterMode,
  FilterKey,
  SortOption,
};

export { DECADE_OPTIONS, ARTSTYLE_OPTIONS, MEDIUM_OPTIONS, SURFACE_OPTIONS };
