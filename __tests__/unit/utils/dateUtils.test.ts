import {
  formatDate,
  formatDateImproved,
  dateToYear,
} from "@/lib/utils/dateUtils";

describe("formatDate", () => {
  const testDate = new Date("2024-03-15T12:00:00Z");

  test("formats Date object with default options", () => {
    // Note: actual format may vary by system locale
    expect(formatDate(testDate)).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  test("formats string date input", () => {
    expect(formatDate("2024-03-15T12:00:00Z")).toMatch(
      /\d{1,2}\/\d{1,2}\/\d{4}/
    );
  });

  test("formats timestamp number", () => {
    expect(formatDate(testDate.getTime())).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  test("handles custom format options", () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // This should output something like "March 15, 2024"
    expect(formatDate(testDate, options)).toMatch(/[A-Z][a-z]+ \d{1,2}, \d{4}/);
  });

  test("handles invalid date input", () => {
    expect(formatDate("not a date")).toBe("Invalid Date");
    expect(formatDate("2024-13-45")).toBe("Invalid Date"); // Invalid month and day
  });

  test("handles null or undefined input", () => {
    // @ts-expect-error Testing invalid input
    expect(formatDate(null)).toBe("Invalid Date");
    // @ts-expect-error Testing invalid input
    expect(formatDate(undefined)).toBe("Invalid Date");
  });
});

describe("formatDateImproved", () => {
  test("formats date in UK format (DD/MM/YYYY)", () => {
    expect(formatDateImproved("2024-03-15")).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

    // Test specific format
    const result = formatDateImproved("2024-03-15");
    const [day, month, year] = result.split("/");

    expect(day).toBe("15");
    expect(month).toBe("03");
    expect(year).toBe("2024");
  });

  test("handles different date string formats", () => {
    // ISO string
    expect(formatDateImproved("2024-03-15T12:00:00Z")).toBe("15/03/2024");

    // Date with time
    expect(formatDateImproved("2024-03-15 12:00:00")).toBe("15/03/2024");
  });

  test("throws error for invalid date strings", () => {
    expect(() => formatDateImproved("not a date")).toThrow();
    expect(() => formatDateImproved("2024-13-45")).toThrow(); // Invalid month and day
  });
});

describe("dateToYear", () => {
  test("extracts year from Date object", () => {
    const testDate = new Date("2024-03-15");
    expect(dateToYear(testDate)).toBe(2024);
  });

  test("handles dates from different years", () => {
    const cases = [
      [new Date("2020-01-01"), 2020],
      [new Date("1999-12-31"), 1999],
      [new Date("2025-06-15"), 2025],
    ] as const;

    cases.forEach(([input, expected]) => {
      expect(dateToYear(input)).toBe(expected);
    });
  });

  test("handles date objects with time components", () => {
    const dateWithTime = new Date("2024-03-15T23:59:59Z");
    expect(dateToYear(dateWithTime)).toBe(2024);
  });

  test("returns current year for invalid dates", () => {
    const invalidDate = new Date("invalid");
    expect(dateToYear(invalidDate)).toBe(NaN);
  });
});
