"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { ArtworkSortConfig, SortOption } from "@/lib/data/types";
import { ColorPicker } from "./ColorPicker";

export interface SortByProps {
  value: ArtworkSortConfig;
  onChange: (value: ArtworkSortConfig) => void;
}

export const SortBy = ({ value, onChange }: SortByProps) => {
  return (
    // <aside className="fixed left-0 w-full md:w-[290px] md:shadow-md bg-whitish">
    <div className="">
      <div className="space-y-4 p-8">
        <Select
          value={value.by}
          onValueChange={(newValue: SortOption) => {
            onChange({
              by: newValue,
              color: newValue === "colorProximity" ? value.color : undefined,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mostRecent">Most Recent</SelectItem>
            <SelectItem value="mostPopular">Most Popular</SelectItem>
            <SelectItem value="mostFeatured">Most Featured</SelectItem>
            <SelectItem value="colorProximity">Color Proximity</SelectItem>
          </SelectContent>
        </Select>

        {value.by === "colorProximity" && (
          <ColorPicker
            onColorSelect={(color) => onChange({ ...value, color })}
            selectedColor={value.color}
          />
        )}
      </div>
    </div>
  );
};
