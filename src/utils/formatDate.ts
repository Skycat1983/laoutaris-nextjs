// src/utils/date.ts

/**
 * Formats a given date into a readable string.
 *
 * @param dateInput - The date to format. Can be a Date object, a date string, or a timestamp.
 * @param options - Optional Intl.DateTimeFormatOptions to customize the formatting.
 * @returns A formatted date string.
 *
 * @example
 * formatDate(new Date()); // "9/17/2023"
 * formatDate("2023-09-17T12:34:56Z", { year: 'numeric', month: 'long', day: 'numeric' }); // "September 17, 2023"
 */
export function formatDate(
  dateInput: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date =
      typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}
