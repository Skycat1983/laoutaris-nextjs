"use client";

import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import type { BlogEntryFrontend } from "@/lib/data/types";

type FilterKey = "featured" | "year" | null;

const featuredFilterOptions = ["true", "false"] as const;

export const deriveBlogYearOptions = (blogs: BlogEntryFrontend[]) =>
  Array.from(
    new Set(
      blogs
        .map((blog) => new Date(blog.displayDate).getFullYear())
        .filter((year) => Number.isFinite(year))
        .map((year) => year.toString())
    )
  ).sort((firstYear, secondYear) => Number(secondYear) - Number(firstYear));

export const getBlogFilterOptions = (yearOptions: readonly string[]) =>
  ({
    featured: featuredFilterOptions,
    year: yearOptions,
  } satisfies Record<"featured" | "year", readonly string[]>);

interface BlogFilterDropdownsProps {
  onFilterChange: (key: FilterKey, value: string | null) => void;
  yearOptions?: readonly string[];
}

export function BlogFilterDropdowns({
  onFilterChange,
  yearOptions = [],
}: BlogFilterDropdownsProps) {
  const [selectedKey, setSelectedKey] = useState<FilterKey | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const filterOptions = getBlogFilterOptions(yearOptions);

  const handleKeyChange = useCallback(
    (key: string) => {
      if (key === "none") {
        setSelectedKey(null);
        setSelectedValue(null);
        onFilterChange(null, null);
      } else {
        const filterKey = key as "featured" | "year";
        setSelectedKey(filterKey);
        setSelectedValue(null);
        onFilterChange(filterKey, null);
      }
    },
    [onFilterChange]
  );

  const handleValueChange = useCallback(
    (value: string) => {
      setSelectedValue(value);
      onFilterChange(selectedKey, value);
    },
    [selectedKey, onFilterChange]
  );

  return (
    <div className="flex gap-4 mb-6">
      <Select onValueChange={handleKeyChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select filter type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Filter</SelectItem>
          <SelectItem value="featured">Featured Status</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={handleValueChange} disabled={!selectedKey}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select value" />
        </SelectTrigger>
        <SelectContent>
          {selectedKey &&
            filterOptions[selectedKey].map((option) => (
              <SelectItem key={option} value={option}>
                {option === "true"
                  ? "Featured"
                  : option === "false"
                  ? "Not Featured"
                  : option}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
