import {
  calculateReadTime,
  type ReadTimeInput,
  type ReadTimeConfig,
  DEFAULT_CONFIG,
} from "@/lib/utils/textUtils";

// Test case types for both input styles
type ReadTimeObjectTestCase = ReadTimeInput & {
  expected: number;
  description: string;
  config?: ReadTimeConfig;
};

type ReadTimeStringTestCase = {
  text?: string;
  expected: number;
  description: string;
  config?: ReadTimeConfig;
};

// Helper functions for creating test cases
const createObjectTest = (
  text: string | undefined,
  expected: number,
  description: string,
  config?: ReadTimeConfig
): ReadTimeObjectTestCase => ({
  text,
  expected,
  description,
  config,
});

const createStringTest = (
  text: string | undefined,
  expected: number,
  description: string,
  config?: ReadTimeConfig
): ReadTimeStringTestCase => ({
  text,
  expected,
  description,
  config,
});

describe("calculateReadTime", () => {
  // Test string input
  describe("with string input", () => {
    test("calculates read time for short text", () => {
      expect(calculateReadTime("This is a test sentence.")).toBe(1);
    });

    test("calculates read time for longer text", () => {
      const text = "word ".repeat(400); // 400 words
      expect(calculateReadTime(text)).toBe(2);
    });

    test("rounds up partial minutes", () => {
      const text = "word ".repeat(250); // 250 words
      expect(calculateReadTime(text)).toBe(2);
    });

    test("handles empty string", () => {
      expect(calculateReadTime("")).toBe(0);
    });

    test("handles whitespace only", () => {
      expect(calculateReadTime("   ")).toBe(0);
    });
  });

  // Test object input
  describe("with object input", () => {
    test("calculates read time with object input", () => {
      expect(calculateReadTime({ text: "This is a test sentence." })).toBe(1);
    });

    test("handles empty text in object", () => {
      expect(calculateReadTime({ text: "" })).toBe(0);
    });

    test("handles undefined text in object", () => {
      expect(calculateReadTime({ text: undefined })).toBe(0);
    });
  });

  // Test configuration
  describe("with custom configuration", () => {
    test("uses custom words per minute", () => {
      const text = "word ".repeat(100); // 100 words
      const config: ReadTimeConfig = { wordsPerMinute: 50 };
      expect(calculateReadTime(text, config)).toBe(2);
    });

    test("uses custom config with object input", () => {
      const input: ReadTimeInput = { text: "word ".repeat(100) };
      const config: ReadTimeConfig = { wordsPerMinute: 50 };
      expect(calculateReadTime(input, config)).toBe(2);
    });

    test("throws error for invalid words per minute", () => {
      expect(() => calculateReadTime("test", { wordsPerMinute: 0 })).toThrow(
        "wordsPerMinute must be a positive number"
      );

      expect(() => calculateReadTime("test", { wordsPerMinute: -1 })).toThrow(
        "wordsPerMinute must be a positive number"
      );
    });
  });

  // Test default configuration
  test("uses default configuration correctly", () => {
    const text = "word ".repeat(DEFAULT_CONFIG.wordsPerMinute);
    expect(calculateReadTime(text)).toBe(1);
  });
});
