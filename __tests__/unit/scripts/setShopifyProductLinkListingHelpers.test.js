const {
  SET_PUBLIC_LISTING_CONFIRMATION,
  buildPublicListingPlan,
  parseArgs,
  validateExecutionOptions,
} = require("../../../scripts/set-shopify-product-link-listing-helpers.cjs");

const artworks = [
  {
    _id: "661fc617648efb163cffacee",
    title: "No.002",
    shopifyProducts: [
      { productId: "100", type: "original", publicListing: false },
      { productId: "101", type: "print", publicListing: false },
      { productId: "102", type: "book", publicListing: true },
    ],
  },
  {
    _id: "68f89a8ae81cb7291cef5e33",
    title: "No.003",
    shopifyProducts: [
      { productId: "200", type: "original", publicListing: false },
      { productId: "201", type: "print", publicListing: true },
    ],
  },
];

describe("set Shopify product-link public listing helpers", () => {
  it("parses options and gates write mode behind exact confirmation", () => {
    expect(
      validateExecutionOptions(
        parseArgs([
          "--mode=write",
          "--type=print",
          "--public-listing=true",
          `--confirm=${SET_PUBLIC_LISTING_CONFIRMATION}`,
        ])
      )
    ).toEqual({
      mode: "write",
      type: "print",
      publicListing: true,
      confirm: SET_PUBLIC_LISTING_CONFIRMATION,
    });

    expect(() =>
      validateExecutionOptions(
        parseArgs(["--mode=write", "--type=print", "--public-listing=true"])
      )
    ).toThrow(`--confirm=${SET_PUBLIC_LISTING_CONFIRMATION}`);
    expect(() =>
      validateExecutionOptions(
        parseArgs([
          "--mode=plan",
          "--type=print",
          "--public-listing=true",
          `--confirm=${SET_PUBLIC_LISTING_CONFIRMATION}`,
        ])
      )
    ).toThrow("Plan mode does not accept a confirmation flag");
  });

  it("builds a plan to make only print links public", () => {
    const report = buildPublicListingPlan({
      artworks,
      type: "print",
      publicListing: true,
      source: {},
      generatedAt: "2026-05-29T00:00:00.000Z",
    });

    expect(report.summary).toEqual({
      artworksScannedWithTargetLinks: 2,
      artworksAlreadyMatching: 1,
      artworksToUpdate: 1,
      artworksUpdated: 0,
      artworksFailed: 0,
      targetLinksScanned: 2,
      targetLinksToChange: 1,
    });
    expect(report.artworks[0].desiredShopifyProducts).toEqual([
      { productId: "100", type: "original", publicListing: false },
      { productId: "101", type: "print", publicListing: true },
      { productId: "102", type: "book", publicListing: true },
    ]);
    expect(report.artworks[1].action).toBe("already_matches");
  });

  it("can plan a rollback that hides print links again", () => {
    const report = buildPublicListingPlan({
      artworks,
      type: "print",
      publicListing: false,
      source: {},
      generatedAt: "2026-05-29T00:00:00.000Z",
    });

    expect(report.summary.artworksToUpdate).toBe(1);
    expect(report.summary.targetLinksToChange).toBe(1);
    expect(report.artworks[1].desiredShopifyProducts[1]).toEqual({
      productId: "201",
      type: "print",
      publicListing: false,
    });
  });

  it("rejects invalid type and public-listing values", () => {
    expect(() =>
      validateExecutionOptions(
        parseArgs(["--type=poster", "--public-listing=true"])
      )
    ).toThrow("Type must be original, print, or book");
    expect(() =>
      validateExecutionOptions(
        parseArgs(["--type=print", "--public-listing=maybe"])
      )
    ).toThrow("public-listing must be true or false");
  });
});
