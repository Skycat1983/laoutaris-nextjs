const {
  LINK_PRODUCTS_CONFIRMATION,
  buildMongoLinkPlan,
  mergeDesiredLinks,
  normalizeProductId,
  parseArgs,
  validateExecutionOptions,
} = require("../../../scripts/link-shopify-catalog-products-helpers.cjs");

const createProduct = ({ family, productId, artworkId }) => ({
  productFamily: family,
  proposedHandle: `joseph-laoutaris-${family}-no002-3cffacee`,
  matchStatus: "exact_match",
  recommendedAction: "preserve_existing_product",
  handleMatch: {
    id: `gid://shopify/Product/${productId}`,
    legacyResourceId: productId,
    handle: `joseph-laoutaris-${family}-no002-3cffacee`,
    title:
      family === "original"
        ? "No.002 - Original Artwork"
        : "No.002 - Fine Art Print",
    status: "DRAFT",
    productType: family === "original" ? "Original Artwork" : "Fine Art Print",
    customMongodbArtworkId: artworkId,
    totalInventory: family === "original" ? 1 : 50,
    adminUrl: `https://example.myshopify.com/admin/products/${productId}`,
  },
  metafieldMatches: [],
  conflicts: [],
  warnings: [],
  manualNumberMatches: [],
});

const createReconciliation = () => {
  const artworkId = "661fc617648efb163cffacee";

  return {
    mode: "read_only_shopify_reconciliation",
    summary: {
      plannedProductsWithConflict: 0,
      queryErrorCount: 0,
      manualReviewCount: 0,
      plannedProductsWithNoMatch: 0,
    },
    artworks: [
      {
        artworkId,
        customMongodbArtworkId: artworkId,
        title: "No.002",
        products: [
          createProduct({
            family: "original",
            productId: "11991754408200",
            artworkId,
          }),
          createProduct({
            family: "print",
            productId: "11991754473736",
            artworkId,
          }),
        ],
      },
    ],
  };
};

describe("link Shopify catalog products helpers", () => {
  it("parses execution options and gates write mode behind exact confirmation", () => {
    expect(
      validateExecutionOptions(
        parseArgs([
          "--mode=write",
          `--confirm=${LINK_PRODUCTS_CONFIRMATION}`,
          "--output=reports/write.json",
        ])
      )
    ).toEqual({
      mode: "write",
      confirm: LINK_PRODUCTS_CONFIRMATION,
      output: "reports/write.json",
    });

    expect(() =>
      validateExecutionOptions(parseArgs(["--mode=write"]))
    ).toThrow(`--confirm=${LINK_PRODUCTS_CONFIRMATION}`);
    expect(() =>
      validateExecutionOptions(
        parseArgs([`--mode=plan`, `--confirm=${LINK_PRODUCTS_CONFIRMATION}`])
      )
    ).toThrow("Plan mode does not accept a confirmation flag");
  });

  it("normalizes numeric and GID Shopify product IDs", () => {
    expect(normalizeProductId("11991754408200")).toBe("11991754408200");
    expect(normalizeProductId("gid://shopify/Product/11991754408200")).toBe(
      "11991754408200"
    );
    expect(normalizeProductId("not-a-product")).toBeNull();
  });

  it("builds a read-only link plan with generated links non-public by default", () => {
    const report = buildMongoLinkPlan({
      reconciliation: createReconciliation(),
      artworks: [
        {
          _id: "661fc617648efb163cffacee",
          title: "No.002",
          shopifyProducts: [
            { productId: "999", type: "original", publicListing: true },
            { productId: "888", type: "book", publicListing: true },
          ],
        },
      ],
      source: {
        reconciliationInputPath: "input.json",
        outputPath: "output.json",
      },
      generatedAt: "2026-05-29T00:00:00.000Z",
    });

    expect(report.mode).toBe("mongodb_shopify_catalog_link_plan");
    expect(report.safety.mongoWritesAllowed).toBe(false);
    expect(report.summary).toEqual({
      artworksScanned: 1,
      artworksAlreadyLinked: 0,
      artworksToUpdate: 1,
      artworksUpdated: 0,
      artworksFailed: 0,
      generatedLinksPlanned: 2,
      publicGeneratedLinksPlanned: 0,
      preservedBookLinks: 1,
      replacedOriginalPrintLinks: 1,
    });
    expect(report.artworks[0].desiredShopifyProducts).toEqual([
      {
        productId: "11991754408200",
        type: "original",
        publicListing: false,
      },
      {
        productId: "11991754473736",
        type: "print",
        publicListing: false,
      },
      { productId: "888", type: "book", publicListing: true },
    ]);
  });

  it("marks already-linked artworks without planning a rewrite", () => {
    const report = buildMongoLinkPlan({
      reconciliation: createReconciliation(),
      artworks: [
        {
          _id: "661fc617648efb163cffacee",
          title: "No.002",
          shopifyProducts: [
            {
              productId: "11991754408200",
              type: "original",
              publicListing: false,
            },
            {
              productId: "11991754473736",
              type: "print",
              publicListing: false,
            },
          ],
        },
      ],
      source: {},
      generatedAt: "2026-05-29T00:00:00.000Z",
    });

    expect(report.summary.artworksAlreadyLinked).toBe(1);
    expect(report.summary.artworksToUpdate).toBe(0);
    expect(report.artworks[0].action).toBe("already_linked");
  });

  it("rejects duplicate desired product IDs", () => {
    expect(() =>
      mergeDesiredLinks({
        existingLinks: [{ productId: "123", type: "book" }],
        generatedLinks: [
          { productId: "123", type: "original", publicListing: false },
        ],
      })
    ).toThrow("duplicate product ID 123");
  });

  it("rejects dirty reconciliation reports", () => {
    const reconciliation = createReconciliation();
    reconciliation.summary.queryErrorCount = 1;

    expect(() =>
      buildMongoLinkPlan({
        reconciliation,
        artworks: [],
        source: {},
      })
    ).toThrow("query errors");
  });
});
