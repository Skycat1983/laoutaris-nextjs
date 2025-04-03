/**
 * RGB color representation
 */
type RGB = {
  r: number;
  g: number;
  b: number;
};

/**
 * HSL color representation
 */
type HSL = {
  h: number;
  s: number;
  l: number;
};

/**
 * Weights for color similarity calculation
 */
type ColorWeights = {
  hue: number;
  saturation: number;
  lightness: number;
};

/**
 * Result of a color similarity comparison
 */
type ColorMatch = {
  color: string;
  similarity: number;
};

/**
 * Year to color mapping type
 */
type YearColorMap = Record<number, string>;

// Default weights for color similarity calculation
const DEFAULT_WEIGHTS: ColorWeights = {
  hue: 1,
  saturation: 0.8,
  lightness: 0.6,
};

// Year to color mapping
const YEAR_COLORS: YearColorMap = {
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

/**
 * Get the color associated with a specific year
 * @param {number} year - The year to get the color for
 * @returns {string} Tailwind CSS color class
 */
function getYearColor(year: number): string {
  return YEAR_COLORS[year] || "bg-gray-500";
}

/**
 * Convert a hex color code to RGB values
 * @param {string} hex - The hex color code (e.g., "#FF0000")
 * @returns {RGB} RGB color values
 * @throws {Error} If hex code is invalid
 */
function hexToRgb(hex: string): RGB {
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    throw new Error("Invalid hex color code");
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/**
 * Convert RGB values to HSL color space
 * @param {RGB} rgb - RGB color values
 * @returns {HSL} HSL color values
 */
function rgbToHsl({ r, g, b }: RGB): HSL {
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
}

/**
 * Calculate similarity between two hex colors
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @param {ColorWeights} weights - Optional weights for HSL components
 * @returns {number} Similarity score (0-100, lower is more similar)
 */
function getColorSimilarity(
  hex1: string,
  hex2: string,
  weights: ColorWeights = DEFAULT_WEIGHTS
): number {
  const color1 = rgbToHsl(hexToRgb(hex1));
  const color2 = rgbToHsl(hexToRgb(hex2));

  // Calculate differences
  const hueDiff =
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
}

/**
 * Find similar colors from a list of available colors
 * @param {string} targetColor - The hex color to find matches for
 * @param {string[]} availableColors - Array of hex colors to compare against
 * @param {number} threshold - Maximum similarity difference (0-100)
 * @returns {ColorMatch[]} Array of matching colors with similarity scores
 */
function findSimilarColors(
  targetColor: string,
  availableColors: string[],
  threshold: number = 30
): ColorMatch[] {
  return availableColors
    .map((color) => ({
      color,
      similarity: getColorSimilarity(targetColor, color),
    }))
    .filter((match) => match.similarity <= threshold)
    .sort((a, b) => a.similarity - b.similarity);
}

// Export types separately
export type { RGB, HSL, ColorWeights, ColorMatch, YearColorMap };

// Export functions and constants
export {
  getYearColor,
  hexToRgb,
  rgbToHsl,
  getColorSimilarity,
  findSimilarColors,
  DEFAULT_WEIGHTS,
  YEAR_COLORS,
};
