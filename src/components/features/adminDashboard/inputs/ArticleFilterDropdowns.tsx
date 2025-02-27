"use client";

import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import type { Section } from "@/lib/data/types/articleTypes";

type FilterKey = "section" | "overlayColour" | null;

const filterOptions: Record<"section" | "overlayColour", string[]> = {
  section: ["artwork", "biography", "project", "collections"],
  overlayColour: ["white", "black"],
} as const;

interface ArticleFilterDropdownsProps {
  onFilterChange: (key: FilterKey, value: string | null) => void;
}

export function ArticleFilterDropdowns({
  onFilterChange,
}: ArticleFilterDropdownsProps) {
  const [selectedKey, setSelectedKey] = useState<FilterKey | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleKeyChange = useCallback(
    (key: string) => {
      if (key === "none") {
        setSelectedKey(null);
        setSelectedValue(null);
        onFilterChange(null, null);
      } else {
        const filterKey = key as "section" | "overlayColour";
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
          <SelectItem value="section">Section</SelectItem>
          <SelectItem value="overlayColour">Overlay Colour</SelectItem>
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
                {option}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
