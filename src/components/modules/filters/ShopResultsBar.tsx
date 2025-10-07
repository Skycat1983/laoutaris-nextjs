"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

type ShopResultsBarProps = {
  totalResults: number;
};

const ShopResultsBar = ({ totalResults }: ShopResultsBarProps) => {
  return (
    <div className="w-full bg-white border-t border-gray-200 px-8 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Results Count */}
        <div className="text-sm text-gray-700">
          Found: <span className="font-medium">{totalResults}</span>
        </div>

        {/* Pagination - Placeholder for now */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border-b-2 border-gray-900 font-medium">
            1
          </button>
          <button className="px-3 py-1 text-sm hover:text-gray-900 text-gray-500">
            2
          </button>
          <span className="px-2 text-gray-400">...</span>
          <button className="px-3 py-1 text-sm hover:text-gray-900 text-gray-500">
            5
          </button>
          <button className="px-2 py-1 text-sm hover:text-gray-900 text-gray-500">
            →
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <Select defaultValue="popular">
            <SelectTrigger className="w-[180px] rounded-none bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ShopResultsBar;
