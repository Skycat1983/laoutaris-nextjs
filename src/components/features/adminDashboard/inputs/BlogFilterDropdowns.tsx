"use client";

import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

type FilterKey = "featured" | "year" | null;

const filterOptions: Record<"featured" | "year", string[]> = {
  featured: ["true", "false"],
  year: ["2020", "2021", "2022", "2023", "2024"],
} as const;

interface BlogFilterDropdownsProps {
  onFilterChange: (key: FilterKey, value: string | null) => void;
}

export function BlogFilterDropdowns({
  onFilterChange,
}: BlogFilterDropdownsProps) {
  const [selectedKey, setSelectedKey] = useState<FilterKey | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

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
