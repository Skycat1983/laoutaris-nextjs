export const getYearColor = (year: number): string => {
  const yearColors: Record<number, string> = {
    2014: "bg-orange-400",
    2015: "bg-indigo-500",
    2016: "bg-green-700",
    2017: "bg-yellow-500",
    2018: "bg-green-500",
    2019: "bg-coral-500",
    2020: "bg-pink-500",
    2021: "bg-purple-500",
    2022: "bg-blue-400",
    2023: "bg-black",
  };

  return yearColors[year] || "bg-gray-500";
};

// Convert hex to RGB
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

// Convert RGB to HSL
const rgbToHsl = ({ r, g, b }: { r: number; g: number; b: number }) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// Calculate color similarity score (0-100, lower is more similar)
const getColorSimilarity = (hex1: string, hex2: string) => {
  const color1 = rgbToHsl(hexToRgb(hex1));
  const color2 = rgbToHsl(hexToRgb(hex2));

  // Weight factors for HSL components
  const weights = {
    hue: 1,
    saturation: 0.8,
    lightness: 0.6,
  };

  // Calculate differences
  let hueDiff =
    Math.min(
      Math.abs(color1.h - color2.h),
      360 - Math.abs(color1.h - color2.h)
    ) / 180; // Normalize to 0-1
  const satDiff = Math.abs(color1.s - color2.s) / 100;
  const lightDiff = Math.abs(color1.l - color2.l) / 100;

  // Weighted average
  const similarity =
    (hueDiff * weights.hue +
      satDiff * weights.saturation +
      lightDiff * weights.lightness) /
    (weights.hue + weights.saturation + weights.lightness);

  // Convert to 0-100 scale (0 being identical)
  return Math.round(similarity * 100);
};

interface ColorMatch {
  color: string;
  similarity: number;
}

// Find similar colors from a list
export const findSimilarColors = (
  targetColor: string,
  availableColors: string[],
  threshold: number = 30 // Default threshold of 30% difference
): ColorMatch[] => {
  return availableColors
    .map((color) => ({
      color,
      similarity: getColorSimilarity(targetColor, color),
    }))
    .filter((match) => match.similarity <= threshold)
    .sort((a, b) => a.similarity - b.similarity);
};

// Example usage:
// const similarColors = findSimilarColors("#FF0000", ["#FF0033", "#CC0000", "#0000FF"]);
// Returns: [{ color: "#FF0033", similarity: 5 }, { color: "#CC0000", similarity: 15 }]
