/**
 * Input parameters for calculating read time
 * @interface ReadTimeInput
 * @property {string} [text] - The text content to analyze. Optional - will return 0 if not provided
 */
type ReadTimeInput = {
  text?: string;
};

/**
 * Configuration for read time calculation
 * @interface ReadTimeConfig
 * @property {number} wordsPerMinute - Average reading speed in words per minute
 */
type ReadTimeConfig = {
  wordsPerMinute: number;
};

/**
 * Default configuration values for read time calculation
 * @constant
 * @type {ReadTimeConfig}
 */
const DEFAULT_CONFIG: ReadTimeConfig = {
  wordsPerMinute: 200,
};

/**
 * Calculates the estimated reading time for a given text
 *
 * @param {string | ReadTimeInput} text - The text to analyze or input object
 * @param {ReadTimeConfig} [config=DEFAULT_CONFIG] - Optional configuration for calculation
 * @returns {number} Estimated reading time in minutes, rounded up to the nearest minute
 *
 * @example
 * // Using string input
 * calculateReadTime("This is some text"); // returns 1
 *
 * @example
 * // Using object input with default config
 * calculateReadTime({ text: "This is some text" }); // returns 1
 *
 * @example
 * // Using custom configuration
 * calculateReadTime("Some text", { wordsPerMinute: 100 }); // returns 1
 *
 * @throws {TypeError} If config.wordsPerMinute is not a positive number
 */
function calculateReadTime(
  text: string | ReadTimeInput,
  config: ReadTimeConfig = DEFAULT_CONFIG
): number {
  // Input validation
  if (config.wordsPerMinute <= 0) {
    throw new TypeError("wordsPerMinute must be a positive number");
  }

  // Handle different input types
  const content = typeof text === "string" ? text : text?.text;

  if (!content) return 0;

  // Trim the text and split on whitespace, filter out empty strings
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordCount = words.length;

  return Math.ceil(wordCount / config.wordsPerMinute);
}

// Export types separately
export type { ReadTimeInput, ReadTimeConfig };

// Export values
export { calculateReadTime, DEFAULT_CONFIG };
