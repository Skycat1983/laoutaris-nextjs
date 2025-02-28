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

interface FilterOption {
  value: string;
  label: string;
}

type FilterMode = "ALL" | "ANY";

const decades: FilterOption[] = [
  { value: "1950s", label: "1950s" },
  { value: "1960s", label: "1960s" },
  { value: "1970s", label: "1970s" },
  { value: "1980s", label: "1980s" },
  { value: "1990s", label: "1990s" },
  { value: "2000s", label: "2000s" },
  { value: "2010s", label: "2010s" },
  { value: "2020s", label: "2020s" },
];

const artStyles: FilterOption[] = [
  { value: "abstract", label: "Abstract" },
  { value: "semi-abstract", label: "Semi-Abstract" },
  { value: "figurative", label: "Figurative" },
];

const mediums: FilterOption[] = [
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

const surfaces: FilterOption[] = [
  { value: "paper", label: "Paper" },
  { value: "canvas", label: "Canvas" },
  { value: "wood", label: "Wood" },
  { value: "film", label: "Film" },
];

interface BasicAccordionFilterProps {
  onFilterChange: (filters: {
    decade?: Decade;
    artstyle?: ArtStyle;
    medium?: Medium;
    surface?: Surface;
  }) => void;
  onClearFilters: () => void;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
}

export const BasicAccordionFilter = ({
  onFilterChange,
  onClearFilters,
  filterMode,
  onFilterModeChange,
}: BasicAccordionFilterProps) => {
  const [pendingFilters, setPendingFilters] = useState<{
    decade?: Decade;
    artstyle?: ArtStyle;
    medium?: Medium;
    surface?: Surface;
  }>({});

  const handleCheckboxChange = (
    key: keyof typeof pendingFilters,
    value: string | undefined
  ) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(pendingFilters);
  };

  const handleClearFilters = () => {
    setPendingFilters({});
    onClearFilters();
  };

  return (
    <aside className="w-[300px] bg-white p-4 border-r h-full bg-whitish shadow-md p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          <Switch
            checked={filterMode === "ALL"}
            onCheckedChange={(checked) =>
              onFilterModeChange(checked ? "ALL" : "ANY")
            }
          />
          <span className="text-sm">
            {filterMode === "ALL" ? "Match All" : "Match Any"}
          </span>
        </div>
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)]">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="decade">
            <AccordionTrigger>Decade</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {decades.map((decade) => (
                  <div
                    key={decade.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`decade-${decade.value}`}
                      checked={pendingFilters.decade === decade.value}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(
                          "decade",
                          checked ? (decade.value as Decade) : undefined
                        );
                      }}
                    />
                    <label
                      htmlFor={`decade-${decade.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {decade.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="style">
            <AccordionTrigger>Art Style</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {artStyles.map((style) => (
                  <div
                    key={style.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`style-${style.value}`}
                      checked={pendingFilters.artstyle === style.value}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(
                          "artstyle",
                          checked ? (style.value as ArtStyle) : undefined
                        );
                      }}
                    />
                    <label
                      htmlFor={`style-${style.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {style.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medium">
            <AccordionTrigger>Medium</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {mediums.map((medium) => (
                  <div
                    key={medium.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`medium-${medium.value}`}
                      checked={pendingFilters.medium === medium.value}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(
                          "medium",
                          checked ? (medium.value as Medium) : undefined
                        );
                      }}
                    />
                    <label
                      htmlFor={`medium-${medium.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {medium.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="surface">
            <AccordionTrigger>Surface</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {surfaces.map((surface) => (
                  <div
                    key={surface.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`surface-${surface.value}`}
                      checked={pendingFilters.surface === surface.value}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(
                          "surface",
                          checked ? (surface.value as Surface) : undefined
                        );
                      }}
                    />
                    <label
                      htmlFor={`surface-${surface.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {surface.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="pt-4 border-t mt-4">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </ScrollArea>
    </aside>
  );
};
