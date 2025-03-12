import { ArtworkListLoader } from "@/components/loaders/viewLoaders/ArtworkListLoader";
import React from "react";
import { ArtworkSortConfig } from "@/lib/data/types";
import { ArtworkFilterParams } from "@/lib/data/types/artworkTypes";
import { SortOption } from "@/lib/constants/artworkConstants";
import { ArtStyle, Medium, Surface } from "@/lib/constants/artworkConstants";
import { Decade } from "@/lib/constants";

interface SearchParams {
  sortBy?: string;
  sortColor?: string;
  decade?: Decade[];
  artstyle?: ArtStyle[];
  medium?: Medium[];
  surface?: Surface[];
  filterMode?: "ALL" | "ANY";
  page?: string;
}

export default async function ArtworkListView({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "1");

  const sortConfig: ArtworkSortConfig = {
    by: (searchParams.sortBy as SortOption) || "colorProximity",
    color: searchParams.sortColor || "#000000",
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

  console.log("URL searchParams:", searchParams);
  console.log("Parsed filters:", filters);
  console.log("Parsed sortConfig:", sortConfig);

  return (
    <div>
      <ArtworkListLoader initialSort={sortConfig} initialFilters={filters} />
    </div>
  );
}
