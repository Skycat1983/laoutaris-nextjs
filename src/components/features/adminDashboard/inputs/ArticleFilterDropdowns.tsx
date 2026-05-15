"use client";

import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  ARTICLE_OVERLAY_COLOUR_OPTIONS,
  ARTICLE_SECTION_OPTIONS,
} from "@/lib/constants/articleConstants";

type ArticleFilterKey = "section" | "overlayColour";
type FilterKey = ArticleFilterKey | null;

export const ARTICLE_FILTER_OPTIONS = {
  section: ARTICLE_SECTION_OPTIONS,
  overlayColour: ARTICLE_OVERLAY_COLOUR_OPTIONS,
} satisfies Record<ArticleFilterKey, readonly string[]>;

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
        const filterKey = key as ArticleFilterKey;
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
            ARTICLE_FILTER_OPTIONS[selectedKey].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
