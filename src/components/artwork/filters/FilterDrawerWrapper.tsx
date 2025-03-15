"use client";

import { Button } from "@/components/shadcn/button";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerDescription,
} from "@/components/shadcn/drawer";
import { useState } from "react";
import { FilterIcon } from "lucide-react";
import {
  ArtworkFilterParams,
  ArtworkSortConfig,
} from "@/lib/data/types/artworkTypes";
import { FilterMode } from "@/lib/constants";

interface FilterProps {
  onApply?: () => void;
  onFilterChange: (filters: ArtworkFilterParams) => void;
  onClearFilters: () => void;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
  initialSort?: ArtworkSortConfig;
}

const FilterButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full px-6 opacity-80"
        onClick={onClick}
        aria-label="Open filters"
      >
        <FilterIcon className="mr-2 h-4 w-4" />
        Filter Gallery
      </Button>
    </div>
  );
};

interface FilterDrawerWrapperProps {
  children: React.ReactNode;
  filterComponent: React.ComponentType<FilterProps>;
  filterProps: Omit<FilterProps, "onApply">;
}

export const FilterDrawerWrapper = ({
  children,
  filterComponent: FilterComponent,
  filterProps,
}: FilterDrawerWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Desktop Filter */}
      <div className="hidden md:block">
        <FilterComponent {...filterProps} />
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden">
        {/* Desktop Sort */}

        <FilterButton onClick={() => setIsOpen(true)} />

        <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
          <DrawerPortal>
            <DrawerOverlay className="fixed inset-0 bg-black/10" />
            <DrawerContent className="fixed inset-y-0 left-0 h-50vh w-3/4 bg-whitish">
              <DrawerTitle className="sr-only">Gallery Filters</DrawerTitle>
              <DrawerDescription className="sr-only">
                Adjust filters and sorting options for the artwork gallery
              </DrawerDescription>
              <div className="h-full overflow-auto">
                <FilterComponent
                  {...filterProps}
                  onApply={() => {
                    setIsOpen(false);
                  }}
                />
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </div>

      {/* Main Content */}
      <div className="md:ml-[300px]">{children}</div>
    </div>
  );
};
