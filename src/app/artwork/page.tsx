import React from "react";

import { ArtworkListLoader } from "@/components/loaders/viewLoaders/ArtworkListLoader";
import type {
  ArtworkFilterParams,
  ArtworkSearchParams,
  ArtworkSortConfig,
} from "@/lib/data/types";
import { SortOption, ART_COLOURS } from "@/lib/constants";

export default async function ArtworkListView({
  searchParams,
}: {
  searchParams: ArtworkSearchParams;
}) {
  const page = parseInt(searchParams.page || "1");

  const sortConfig: ArtworkSortConfig = {
    by: (searchParams.sortBy as SortOption) || "colorProximity",
    color: searchParams.sortColor || ART_COLOURS["blue"],
  };

  const filters: ArtworkFilterParams = {
    decade: Array.isArray(searchParams.decade)
      ? searchParams.decade
      : searchParams.decade
      ? [searchParams.decade]
      : [],
    artstyle: Array.isArray(searchParams.artstyle)
      ? searchParams.artstyle
      : searchParams.artstyle
      ? [searchParams.artstyle]
      : [],
    medium: Array.isArray(searchParams.medium)
      ? searchParams.medium
      : searchParams.medium
      ? [searchParams.medium]
      : [],
    surface: Array.isArray(searchParams.surface)
      ? searchParams.surface
      : searchParams.surface
      ? [searchParams.surface]
      : [],
    filterMode: searchParams.filterMode || "ALL",
    page,
  };

  // console.log("URL searchParams:", searchParams);
  // console.log("Parsed filters:", filters);
  // console.log("Parsed sortConfig:", sortConfig);

  return (
    <div>
      <ArtworkListLoader initialSort={sortConfig} initialFilters={filters} />
    </div>
  );
}
