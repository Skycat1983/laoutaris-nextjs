import {
  getYearColor,
  hexToRgb,
  rgbToHsl,
  getColorSimilarity,
  findSimilarColors,
  YEAR_COLORS,
  DEFAULT_WEIGHTS,
  type RGB,
  type HSL,
  type ColorMatch,
} from "@/lib/utils/colourUtils";

describe("getYearColor", () => {
  test("returns correct color for known years", () => {
    expect(getYearColor(2023)).toBe("bg-black");
    expect(getYearColor(2014)).toBe("bg-orange-400");
  });

  test("returns fallback color for unknown years", () => {
    expect(getYearColor(1999)).toBe("bg-gray-500");
    expect(getYearColor(2024)).toBe("bg-gray-500");
  });
});

describe("hexToRgb", () => {
  test("converts valid hex colors to RGB", () => {
    expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb("#00FF00")).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb("#0000FF")).toEqual({ r: 0, g: 0, b: 255 });
  });

  test("throws error for invalid hex codes", () => {
    expect(() => hexToRgb("FF0000")).toThrow("Invalid hex color code");
    expect(() => hexToRgb("#FF00")).toThrow("Invalid hex color code");
    expect(() => hexToRgb("#GG0000")).toThrow("Invalid hex color code");
  });
});

describe("rgbToHsl", () => {
  test("converts RGB to HSL", () => {
    const cases: Array<[RGB, HSL]> = [
      [
        { r: 255, g: 0, b: 0 },
        { h: 0, s: 100, l: 50 },
      ],
      [
        { r: 0, g: 255, b: 0 },
        { h: 120, s: 100, l: 50 },
      ],
      [
        { r: 128, g: 128, b: 128 },
        { h: 0, s: 0, l: 50 },
      ],
    ];

    cases.forEach(([input, expected]) => {
      const result = rgbToHsl(input);
      expect(result).toEqual(expected);
    });
  });
});

describe("getColorSimilarity", () => {
  test("returns 0 for identical colors", () => {
    expect(getColorSimilarity("#FF0000", "#FF0000")).toBe(0);
    expect(getColorSimilarity("#00FF00", "#00FF00")).toBe(0);
  });

  test("returns higher values for different colors", () => {
    const similarity = getColorSimilarity("#FF0000", "#0000FF");
    expect(similarity).toBeGreaterThan(20);
  });

  test("respects custom weights", () => {
    const customWeights = {
      hue: 2,
      saturation: 0.3,
      lightness: 0.2,
    };

    const defaultSimilarity = getColorSimilarity("#FF0000", "#FF3300");
    const customSimilarity = getColorSimilarity(
      "#FF0000",
      "#FF3300",
      customWeights
    );

    expect(customSimilarity).not.toBe(defaultSimilarity);
  });

  test("throws error for invalid hex codes", () => {
    expect(() => getColorSimilarity("invalid", "#FF0000")).toThrow();
    expect(() => getColorSimilarity("#FF0000", "invalid")).toThrow();
  });
});

describe("findSimilarColors", () => {
  const availableColors = ["#FF0000", "#FF3300", "#0000FF", "#00FF00"];

  test("finds similar colors within threshold", () => {
    const result = findSimilarColors("#FF0000", availableColors, 30);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].color).toBe("#FF0000"); // Most similar should be itself
    expect(result[1].color).toBe("#FF3300"); // Second most similar
  });

  test("returns array with only exact matches for low threshold", () => {
    const result = findSimilarColors("#FF0000", availableColors, 1);
    expect(result.length).toBe(1); // Only the exact match
    expect(result[0].color).toBe("#FF0000");
  });

  test("sorts results by similarity", () => {
    const result = findSimilarColors("#FF0000", availableColors, 100);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: expect.any(String),
          similarity: expect.any(Number),
        }),
      ])
    );

    // Check if sorted
    const similarities = result.map((r) => r.similarity);
    const sortedSimilarities = [...similarities].sort((a, b) => a - b);
    expect(similarities).toEqual(sortedSimilarities);
  });
});
