import React from "react";

import { ArtworkListLoader } from "@/components/loaders/viewLoaders/ArtworkListLoader";
import type { ArtworkFilterParams, ArtworkSortConfig } from "@/lib/data/types";
import {
  parseArtworkListQuery,
  type ArtworkListQuery,
  type ArtworkListQueryInput,
} from "@/lib/data/schemas/artworkListQuerySchema";

export const dynamic = "force-dynamic";

const getDefaultArtworkListQuery = () => {
  const parsedDefaultQuery = parseArtworkListQuery({});

  if (!parsedDefaultQuery.success) {
    throw new Error("Default artwork list query is invalid");
  }

  return parsedDefaultQuery.data;
};

const getPageArtworkListQuery = (
  searchParams: ArtworkListQueryInput
): ArtworkListQuery => {
  const parsedQuery = parseArtworkListQuery(searchParams);

  return parsedQuery.success ? parsedQuery.data : getDefaultArtworkListQuery();
};

const toLoaderProps = (query: ArtworkListQuery) => {
  const sortConfig: ArtworkSortConfig = {
    by: query.sortBy ?? "mostRecent",
    color: query.sortColor,
  };

  const filters: ArtworkFilterParams = {
    decade: query.decade,
    artstyle: query.artstyle,
    medium: query.medium,
    surface: query.surface,
    filterMode: query.filterMode ?? "ALL",
    page: query.page,
    limit: query.limit,
  };

  return { sortConfig, filters };
};

export default async function ArtworkListView({
  searchParams,
}: {
  searchParams: ArtworkListQueryInput;
}) {
  const { sortConfig, filters } = toLoaderProps(
    getPageArtworkListQuery(searchParams)
  );

  return (
    <main>
      <h1 className="sr-only">Artwork</h1>
      <ArtworkListLoader initialSort={sortConfig} initialFilters={filters} />
    </main>
  );
}
