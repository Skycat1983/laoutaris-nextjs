"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Checkbox } from "@/components/shadcn/checkbox";
import { ArtStyle, Decade, Medium, Surface } from "@/lib/data/types";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { useState } from "react";
import { Switch } from "@/components/shadcn/switch";
import { ArtworkFilterParams } from "@/lib/data/types/artworkTypes";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";

type FilterMode = "ALL" | "ANY";

interface DecadeOption {
  value: Decade;
  label: string;
}

interface ArtStyleOption {
  value: ArtStyle;
  label: string;
}

interface MediumOption {
  value: Medium;
  label: string;
}

interface SurfaceOption {
  value: Surface;
  label: string;
}

// Update the constants with their specific types
const decades: DecadeOption[] = [
  { value: "1950s", label: "1950s" },
  { value: "1960s", label: "1960s" },
  { value: "1970s", label: "1970s" },
  { value: "1980s", label: "1980s" },
  { value: "1990s", label: "1990s" },
  { value: "2000s", label: "2000s" },
  { value: "2010s", label: "2010s" },
  { value: "2020s", label: "2020s" },
];

const artStyles: ArtStyleOption[] = [
  { value: "abstract", label: "Abstract" },
  { value: "semi-abstract", label: "Semi-Abstract" },
  { value: "figurative", label: "Figurative" },
];

const mediums: MediumOption[] = [
  { value: "oil", label: "Oil" },
  { value: "acrylic", label: "Acrylic" },
  { value: "paint", label: "Paint" },
  { value: "watercolour", label: "Watercolour" },
  { value: "pastel", label: "Pastel" },
  { value: "pencil", label: "Pencil" },
  { value: "charcoal", label: "Charcoal" },
  { value: "ink", label: "Ink" },
  { value: "sand", label: "Sand" },
];

const surfaces: SurfaceOption[] = [
  { value: "paper", label: "Paper" },
  { value: "canvas", label: "Canvas" },
  { value: "wood", label: "Wood" },
  { value: "film", label: "Film" },
];

interface BasicAccordionFilterProps {
  onFilterChange: (filters: ArtworkFilterParams) => void;
  onClearFilters: () => void;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
}

type FilterKey = "decade" | "artstyle" | "medium" | "surface";

type FilterValue = Decade | ArtStyle | Medium | Surface;

export const BasicAccordionFilter = ({
  onFilterChange,
  onClearFilters,
  filterMode,
  onFilterModeChange,
}: BasicAccordionFilterProps) => {
  const [pendingFilters, setPendingFilters] = useState<ArtworkFilterParams>({
    decade: [],
    artstyle: [],
    medium: [],
    surface: [],
    filterMode: "ALL",
  });

  const handleCheckboxChange = (key: FilterKey, value: FilterValue) => {
    setPendingFilters((prev) => {
      const currentValues = (prev[key] || []) as FilterValue[];

      // In ALL mode
      if (filterMode === "ALL") {
        // If clicking the already-selected value, deselect it
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [key]: [],
          };
        }
        // If selecting a new value, replace any existing value
        return {
          ...prev,
          [key]: [value],
        };
      }

      // In ANY mode, maintain the original toggle behavior
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [key]: newValues,
      };
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(pendingFilters);
  };

  const handleClearFilters = () => {
    setPendingFilters({
      decade: [],
      artstyle: [],
      medium: [],
      surface: [],
      filterMode: "ALL",
    });
    onClearFilters();
  };

  // Add this new function to handle mode changes
  const handleFilterModeChange = (checked: boolean) => {
    const newMode = checked ? "ALL" : "ANY";

    // If switching to ALL mode, keep only the first selected value in each category
    if (newMode === "ALL") {
      setPendingFilters((prev) => ({
        ...prev,
        decade: prev.decade?.slice(0, 1) || [],
        artstyle: prev.artstyle?.slice(0, 1) || [],
        medium: prev.medium?.slice(0, 1) || [],
        surface: prev.surface?.slice(0, 1) || [],
        filterMode: newMode,
      }));
    } else {
      setPendingFilters((prev) => ({
        ...prev,
        filterMode: newMode,
      }));
    }

    onFilterModeChange(newMode);
  };

  // Add this helper function at component level
  const isValueInArray = (
    arr: FilterValue[] | undefined,
    value: FilterValue
  ): boolean => {
    return arr?.includes(value) || false;
  };

  const renderFilterOptions = (
    options: (DecadeOption | ArtStyleOption | MediumOption | SurfaceOption)[],
    key: FilterKey
  ) => {
    if (filterMode === "ALL") {
      return (
        <RadioGroup
          value={pendingFilters[key]?.[0] || ""}
          onValueChange={(value: string) => {
            setPendingFilters((prev) => ({
              ...prev,
              [key]: value ? [value as FilterValue] : [],
            }));
          }}
        >
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${key}-${option.value}`}
                />
                <label
                  htmlFor={`${key}-${option.value}`}
                  className="text-sm font-medium leading-none"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${key}-${option.value}`}
              checked={isValueInArray(pendingFilters[key], option.value)}
              onCheckedChange={() => {
                handleCheckboxChange(key, option.value as FilterValue);
              }}
            />
            <label
              htmlFor={`${key}-${option.value}`}
              className="text-sm font-medium leading-none"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <aside className="w-[300px] bg-white p-4 border-r h-full bg-whitish shadow-md p-8">
      <div className="flex items-center gap-2 mb-4">
        <Switch
          checked={filterMode === "ALL"}
          onCheckedChange={handleFilterModeChange}
        />
        <span className="text-sm">
          {filterMode === "ALL" ? "Match All" : "Match Any"}
        </span>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)]">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="decade">
            <AccordionTrigger>Decade</AccordionTrigger>
            <AccordionContent>
              {renderFilterOptions(decades, "decade")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="style">
            <AccordionTrigger>Art Style</AccordionTrigger>
            <AccordionContent>
              {renderFilterOptions(artStyles, "artstyle")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medium">
            <AccordionTrigger>Medium</AccordionTrigger>
            <AccordionContent>
              {renderFilterOptions(mediums, "medium")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="surface">
            <AccordionTrigger>Surface</AccordionTrigger>
            <AccordionContent>
              {renderFilterOptions(surfaces, "surface")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4 border-t mt-4 space-y-2">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="w-full border border-gray-300 text-gray-600 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </ScrollArea>
    </aside>
  );
};
