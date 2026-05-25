"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import {
  SHOP_ARTSTYLE_FILTER_OPTIONS,
  SHOP_DECADE_FILTER_OPTIONS,
  SHOP_MEDIUM_FILTER_OPTIONS,
  SHOP_SURFACE_FILTER_OPTIONS,
} from "@/lib/data/options/shopFilterOptions";
import type { ShopFiltersState } from "@/lib/data/types/shopTypes";

type ShopFiltersProps = {
  filters: ShopFiltersState;
  onFilterChange: (filters: Partial<ShopFiltersState>) => void;
};

const ShopFilters = ({ filters, onFilterChange }: ShopFiltersProps) => {
  return (
    <div className="w-full bg-white px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-base mb-6">Filter by:</h3>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Art Style Filter */}
          <Select
            value={filters.artstyle || "all-style"}
            onValueChange={(value) => onFilterChange({ artstyle: value })}
          >
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Art Style" />
            </SelectTrigger>
            <SelectContent>
              {SHOP_ARTSTYLE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Medium Filter */}
          <Select
            value={filters.medium || "all-medium"}
            onValueChange={(value) => onFilterChange({ medium: value })}
          >
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Medium" />
            </SelectTrigger>
            <SelectContent>
              {SHOP_MEDIUM_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Surface/Technique Filter */}
          <Select
            value={filters.surface || "all-surface"}
            onValueChange={(value) => onFilterChange({ surface: value })}
          >
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Surface" />
            </SelectTrigger>
            <SelectContent>
              {SHOP_SURFACE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Decade/Epochs Filter */}
          <Select
            value={filters.decade || "all-epochs"}
            onValueChange={(value) => onFilterChange({ decade: value })}
          >
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Decades" />
            </SelectTrigger>
            <SelectContent>
              {SHOP_DECADE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>

        {/* Checkbox Filters */}
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="originals"
              className="rounded-none"
              checked={filters.showOriginals ?? true}
              onCheckedChange={(checked) =>
                onFilterChange({ showOriginals: checked === true })
              }
            />
            <Label
              htmlFor="originals"
              className="text-sm font-normal cursor-pointer"
            >
              Original artworks
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="limited-edition"
              className="rounded-none"
              checked={filters.showPrints ?? true}
              onCheckedChange={(checked) =>
                onFilterChange({ showPrints: checked === true })
              }
            />
            <Label
              htmlFor="limited-edition"
              className="text-sm font-normal cursor-pointer"
            >
              Limited edition
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="books"
              className="rounded-none"
              checked={filters.showBooks ?? true}
              onCheckedChange={(checked) =>
                onFilterChange({ showBooks: checked === true })
              }
            />
            <Label
              htmlFor="books"
              className="text-sm font-normal cursor-pointer"
            >
              Books
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopFilters;
