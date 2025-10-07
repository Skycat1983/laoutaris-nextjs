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

const ShopFilters = () => {
  return (
    <div className="w-full bg-white px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-base mb-6">Filter by:</h3>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Art Style Filter */}
          <Select defaultValue="all-style">
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Art Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-style">All Styles</SelectItem>
              <SelectItem value="abstract">Abstract</SelectItem>
              <SelectItem value="semi-abstract">Semi-Abstract</SelectItem>
              <SelectItem value="figurative">Figurative</SelectItem>
            </SelectContent>
          </Select>

          {/* Medium Filter */}
          <Select defaultValue="all-medium">
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Medium" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-medium">All Mediums</SelectItem>
              <SelectItem value="oil">Oil</SelectItem>
              <SelectItem value="acrylic">Acrylic</SelectItem>
              <SelectItem value="watercolour">Watercolour</SelectItem>
              <SelectItem value="ink">Ink</SelectItem>
              <SelectItem value="sand">Sand</SelectItem>
              <SelectItem value="charcoal">Charcoal</SelectItem>
              <SelectItem value="pencil">Pencil</SelectItem>
            </SelectContent>
          </Select>

          {/* Colours Filter */}
          <Select defaultValue="all-colours">
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Colours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-colours">All Colours</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="pink">Pink</SelectItem>
              <SelectItem value="brown">Brown</SelectItem>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="gray">Gray</SelectItem>
              <SelectItem value="multicolor">Multicolor</SelectItem>
            </SelectContent>
          </Select>

          {/* Surface/Technique Filter */}
          <Select defaultValue="all-surface">
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Surface" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-surface">All Surfaces</SelectItem>
              <SelectItem value="canvas">Canvas</SelectItem>
              <SelectItem value="paper">Paper</SelectItem>
              <SelectItem value="wood">Wood</SelectItem>
              <SelectItem value="film">Film</SelectItem>
            </SelectContent>
          </Select>

          {/* Decade/Epochs Filter */}
          <Select defaultValue="all-epochs">
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Decades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-epochs">All Decades</SelectItem>
              <SelectItem value="1950s">1950s</SelectItem>
              <SelectItem value="1960s">1960s</SelectItem>
              <SelectItem value="1970s">1970s</SelectItem>
              <SelectItem value="1980s">1980s</SelectItem>
              <SelectItem value="1990s">1990s</SelectItem>
              <SelectItem value="2000s">2000s</SelectItem>
              <SelectItem value="2010s">2010s</SelectItem>
            </SelectContent>
          </Select>

          {/* Dimensions/Size Filter */}
          <Select defaultValue="all-dimensions">
            <SelectTrigger className="w-[160px] rounded-none bg-white">
              <SelectValue placeholder="Dimensions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-dimensions">All Sizes</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checkbox Filters */}
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center space-x-2">
            <Checkbox id="originals" className="rounded-none" />
            <Label
              htmlFor="originals"
              className="text-sm font-normal cursor-pointer"
            >
              Original artworks
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="limited-edition" className="rounded-none" />
            <Label
              htmlFor="limited-edition"
              className="text-sm font-normal cursor-pointer"
            >
              Limited edition
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="books" className="rounded-none" />
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
