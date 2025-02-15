"use client";

import { useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  Decade,
  ArtStyle,
  Medium,
  Surface,
} from "@/lib/data/types/artworkTypes";

type FilterKey = "decade" | "artstyle" | "medium" | "surface";

const filterOptions: Record<FilterKey, string[]> = {
  decade: [
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s",
  ],
  artstyle: ["abstract", "semi-abstract", "figurative"],
  medium: [
    "oil",
    "acrylic",
    "paint",
    "watercolour",
    "pastel",
    "pencil",
    "charcoal",
    "ink",
    "sand",
  ],
  surface: ["paper", "canvas", "wood", "film"],
};

interface ArtworkFilterDropdownsProps {
  onFilterChange: (key: FilterKey | null, value: string | null) => void;
}

export function ArtworkFilterDropdowns({
  onFilterChange,
}: ArtworkFilterDropdownsProps) {
  const [selectedKey, setSelectedKey] = useState<FilterKey | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleKeyChange = useCallback(
    (key: FilterKey) => {
      setSelectedKey(key);
      setSelectedValue(null);
      onFilterChange(key, null);
      console.log("Selected key:", key);
    },
    [onFilterChange]
  );

  const handleValueChange = useCallback(
    (value: string) => {
      setSelectedValue(value);
      onFilterChange(selectedKey, value);
      console.log("Selected value:", value);
    },
    [selectedKey, onFilterChange]
  );

  return (
    <div className="flex gap-4 mb-6">
      <Select onValueChange={handleKeyChange as (value: string) => void}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select filter type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="decade">Decade</SelectItem>
          <SelectItem value="artstyle">Art Style</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="surface">Surface</SelectItem>
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
