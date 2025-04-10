import {
  createSubnavLink,
  type BaseLink,
} from "@/lib/helpers/createSubnavLink";
import type { SubnavLink } from "@/components/modules/navigation/subnav/Subnav";

// Define test case type following the pattern
type SubnavLinkTestCase = {
  base: BaseLink;
  options: {
    stem: string;
    segments?: string[];
    forceDisabled?: boolean;
  };
  expected: SubnavLink;
  description: string;
};

// Helper function to create test cases
const createTestCase = (
  base: BaseLink,
  options: SubnavLinkTestCase["options"],
  expected: SubnavLink,
  description: string
): SubnavLinkTestCase => ({
  base,
  options,
  expected,
  description,
});

describe("createSubnavLink", () => {
  // Base test data
  const baseLink: BaseLink = {
    label: "Test Link",
    slug: "test-slug",
  };

  // Happy path test cases
  const validCases: SubnavLinkTestCase[] = [
    createTestCase(
      baseLink,
      { stem: "api" },
      {
        label: "Test Link",
        slug: "test-slug",
        link_to: "/api/test-slug",
        disabled: false,
      },
      "creates basic link with stem only"
    ),
    createTestCase(
      baseLink,
      { stem: "api", segments: ["section", "subsection"] },
      {
        label: "Test Link",
        slug: "test-slug",
        link_to: "/api/test-slug/section/subsection",
        disabled: false,
      },
      "creates link with additional segments"
    ),
    createTestCase(
      { label: "Another Link", slug: "another-slug" },
      { stem: "dashboard" },
      {
        label: "Another Link",
        slug: "another-slug",
        link_to: "/dashboard/another-slug",
        disabled: false,
      },
      "creates link with different base data"
    ),
  ];

  // Edge cases
  const edgeCases: SubnavLinkTestCase[] = [
    createTestCase(
      baseLink,
      { stem: "api", segments: [] },
      {
        label: "Test Link",
        slug: "test-slug",
        link_to: "/api/test-slug",
        disabled: false,
      },
      "handles empty segments array"
    ),
    createTestCase(
      baseLink,
      { stem: "", segments: ["section"] },
      {
        label: "Test Link",
        slug: "test-slug",
        link_to: "/test-slug/section",
        disabled: false,
      },
      "handles empty stem with single forward slash"
    ),
  ];

  // Disabled cases
  const disabledCases: SubnavLinkTestCase[] = [
    createTestCase(
      baseLink,
      { stem: "api", forceDisabled: true },
      {
        label: "Test Link",
        slug: "test-slug",
        link_to: null,
        disabled: true,
      },
      "creates disabled link when forceDisabled is true"
    ),
    createTestCase(
      baseLink,
      { stem: "api", segments: ["section"], forceDisabled: true },
      {
        label: "Test Link",
        slug: "test-slug",
        link_to: null,
        disabled: true,
      },
      "creates disabled link ignoring segments when forceDisabled is true"
    ),
  ];

  // Test all valid cases
  test.each(validCases)(
    "valid case: $description",
    ({ base, options, expected }) => {
      const result = createSubnavLink(base, options);
      expect(result).toEqual(expected);
    }
  );

  // Test edge cases
  test.each(edgeCases)(
    "edge case: $description",
    ({ base, options, expected }) => {
      const result = createSubnavLink(base, options);
      expect(result).toEqual(expected);
    }
  );

  // Test disabled cases
  test.each(disabledCases)(
    "disabled case: $description",
    ({ base, options, expected }) => {
      const result = createSubnavLink(base, options);
      expect(result).toEqual(expected);
    }
  );

  // Test type safety
  it("preserves all base link properties", () => {
    const base: BaseLink = {
      label: "Complex Link",
      slug: "complex-slug",
    };

    const result = createSubnavLink(base, { stem: "api" });

    expect(result).toMatchObject({
      label: base.label,
      slug: base.slug,
    });
  });
});
