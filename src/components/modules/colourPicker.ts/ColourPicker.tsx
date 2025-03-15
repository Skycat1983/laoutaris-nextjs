"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { HexColorPicker } from "react-colorful";

interface ColourPickerProps {
  initialColor: string;
  onColorSelect?: (color: string) => void;
}

interface PopoverPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColourPicker = ({ initialColor, onColorSelect }: ColourPickerProps) => {
  const [color, setColor] = useState(initialColor || "#aabbcc");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorSelect?.(newColor);
  };

  return <PopoverPicker color={color} onChange={handleColorChange} />;
};

const PopoverPicker = ({ color, onChange }: PopoverPickerProps) => {
  const popover = useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="picker relative inline-block">
      <div
        className="swatch w-12 h-8 rounded cursor-pointer border border-gray-200"
        style={{ backgroundColor: color }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div
          className="popover absolute z-[100] top-[calc(100%+5px)] left-0"
          ref={popover}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) return;

      handler(event);
    };

    const validateEventStart = (event: MouseEvent | TouchEvent) => {
      startedWhenMounted = !!ref.current;
      startedInside = !!(
        ref.current && ref.current.contains(event.target as Node)
      );
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

export { ColourPicker, PopoverPicker };
