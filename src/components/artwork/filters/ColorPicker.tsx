"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { cn } from "@/lib/utils";

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
  const [selectedColor, setSelectedColor] = useState(initialColor || "#000000");
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color);

    // Add to recent colors
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
          {/* <Input
            type="text"
            value={selectedColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="uppercase"
            placeholder="#000000"
          /> */}
        </div>
      </div>

      {/* Preset colors */}
      {/* <div className="space-y-2">
        <Label>Preset Colors</Label>
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <Button
              key={color}
              className="w-8 h-8 rounded-full p-0 cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div> */}

      {/* Recent colors */}
      {/* {recentColors.length > 0 && (
        <div className="space-y-2">
          <Label>Recent Colors</Label>
          <div className="flex gap-2">
            {recentColors.map((color) => (
              <Button
                key={color}
                className="w-8 h-8 rounded-full p-0 cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>
      )} */}

      {/* Selected color preview */}
      {/* <div className="space-y-2">
        <Label>Selected Color</Label>
        <div
          className="w-full h-20 rounded-md border"
          style={{ backgroundColor: selectedColor }}
        />
      </div> */}
    </div>
  );
};
