"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { cn } from "@/lib/utils";
import { ART_COLOURS } from "@/lib/constants";
interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  className?: string;
  selectedColor?: string;
}

export const ColorPicker = ({
  onColorSelect,
  className,
  selectedColor: initialColor,
}: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState(
    initialColor || ART_COLOURS["blue"]
  );
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color);

    setRecentColors((prev) => {
      const newRecent = [color, ...prev.filter((c) => c !== color)].slice(0, 5);
      return newRecent;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main color input */}
      <div className="space-y-2">
        <Label htmlFor="color-input">Select Colour</Label>
        <div className="flex gap-2">
          <Input
            id="color-input"
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="h-10 w-20 p-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
