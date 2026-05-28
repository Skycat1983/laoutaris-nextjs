const {
  ARCHIVE_CONFIRMATION,
  PRODUCT_ARCHIVE_MUTATION,
  buildCleanupReport,
  createArchiveMutationVariables,
  hasBlockingCleanupValidation,
  parseArgs,
  validateExecutionOptions,
} = require("../../../scripts/cleanup-shopify-manual-catalog-helpers.cjs");

const createProduct = ({
  id,
  handle,
  title,
  status = "ACTIVE",
  productType = "",
  tags = [],
}) => ({
  id: `gid://shopify/Product/${id}`,
  legacyResourceId: id,
  handle,
  title,
  productType,
  status,
  tags,
  customMongodbArtworkId: null,
  totalInventory: 1,
  adminUrl: `https://example.myshopify.com/admin/products/${id}`,
});

const createReport = ({ artworks, queryErrors = [] }) => ({
  generatedAt: "2026-05-28T00:00:00.000Z",
  mode: "read_only_shopify_reconciliation",
  source: {
    planInputPath: "reports/shopify-catalog-dry-run-plan.json",
    shopDomain: "example.myshopify.com",
    adminApiVersion: "2026-04",
  },
  safety: {
    readOnly: true,
    shopifyMutationsAllowed: false,
    mongoWritesAllowed: false,
    cloudinaryWritesAllowed: false,
    tokensPersisted: false,
  },
  summary: {
    queryErrorCount: queryErrors.length,
  },
  artworks,
  queryErrors,
});

const createArtwork = ({ artworkId, artworkNumber, productResults }) => ({
  artworkId,
  title: `No.${artworkNumber}`,
  customMongodbArtworkId: artworkId,
  artworkNumber,
  matchesByArtworkMetafield: [],
  matchesByManualArtworkNumber: productResults.flatMap(
    (productResult) => productResult.manualNumberMatches ?? []
  ),
  products: productResults,
  conflicts: [],
  warnings: [],
});

describe("cleanup Shopify manual catalog helpers", () => {
  it("parses guarded cleanup options and rejects delete mode", () => {
    expect(parseArgs([])).toEqual({ mode: "dry-run" });
    expect(
      parseArgs([
        "--reconciliation=reports/reconciliation.json",
        "--output=reports/cleanup.json",
        "--mode=archive",
        `--confirm=${ARCHIVE_CONFIRMATION}`,
      ])
    ).toEqual({
      mode: "archive",
      reconciliation: "reports/reconciliation.json",
      output: "reports/cleanup.json",
      confirm: ARCHIVE_CONFIRMATION,
    });
    expect(() =>
      validateExecutionOptions(parseArgs(["--mode=archive"]))
    ).toThrow(`--confirm=${ARCHIVE_CONFIRMATION}`);
    expect(() => parseArgs(["--mode=delete"])).toThrow(
      "Delete mode is intentionally not implemented"
    );
  });

  it("builds an archive-first cleanup report from manual matches and conflict rows only", () => {
    const cleanPrint = createProduct({
      id: "10538862346504",
      handle: "joseph-laoutaris-fine-art-print-no-026",
      title: "No.026, Limited Edition Print",
    });
    const conflictedOriginal = createProduct({
      id: "10548307624200",
      handle: "no-214-original-artwork",
      title: "No.104, Original Artwork",
      status: "DRAFT",
    });
    const ignoredHandleMatch = createProduct({
      id: "999999",
      handle: "joseph-laoutaris-original-no026-generated",
      title: "No.026, Original Artwork",
    });
    const reconciliationReport = createReport({
      artworks: [
        createArtwork({
          artworkId: "artwork-026",
          artworkNumber: "026",
          productResults: [
            {
              productFamily: "original",
              proposedHandle: "joseph-laoutaris-original-no026",
              matchStatus: "handle_only_match",
              handleMatch: ignoredHandleMatch,
              metafieldMatches: [],
              manualNumberMatches: [],
              conflicts: [],
              warnings: [],
            },
            {
              productFamily: "print",
              proposedHandle: "joseph-laoutaris-print-no026",
              matchStatus: "manual_product_match",
              manualNumberMatches: [cleanPrint],
              conflicts: [],
              warnings: [],
            },
          ],
        }),
        createArtwork({
          artworkId: "artwork-104",
          artworkNumber: "104",
          productResults: [
            {
              productFamily: "original",
              proposedHandle: "joseph-laoutaris-original-no104",
              matchStatus: "conflict",
              manualNumberMatches: [conflictedOriginal],
              conflicts: [
                {
                  code: "ambiguous_manual_number_product_number",
                  shopifyProductId: conflictedOriginal.id,
                  shopifyProductHandle: conflictedOriginal.handle,
                },
              ],
              warnings: [],
            },
          ],
        }),
      ],
    });

    const report = buildCleanupReport({
      reconciliationReport,
      reconciliationInputPath: "reports/reconciliation.json",
      outputPath: "reports/cleanup.json",
      mode: "archive",
      generatedAt: "2026-05-28T01:00:00.000Z",
    });

    expect(report.safety).toMatchObject({
      shopifyMutationsAllowed: true,
      deleteProductsAllowed: false,
      productDiscoveryAllowed: false,
      mongoWritesAllowed: false,
      cloudinaryWritesAllowed: false,
      bookProductsAllowed: false,
    });
    expect(report.summary).toMatchObject({
      candidatesFound: 2,
      productsTargeted: 2,
      productsRejected: 0,
      archiveAttempts: 2,
    });
    expect(report.products.map((product) => product.handle)).toEqual([
      "joseph-laoutaris-fine-art-print-no-026",
      "no-214-original-artwork",
    ]);
    expect(report.products[1]).toMatchObject({
      previousStatus: "DRAFT",
      inferredFamily: "original",
      evidenceSources: ["manualNumberMatches", "conflict"],
      action: "archive_product",
    });
    expect(hasBlockingCleanupValidation(report)).toBe(false);
  });

  it("rejects book-like and non-original-print candidates before any archive attempt", () => {
    const bookProduct = createProduct({
      id: "10538938761480",
      handle: "the-complete-artwork-of-joseph-laoutaris",
      title: "The Complete Artwork of Joseph Laoutaris",
      productType: "Book",
      tags: ["publication"],
    });
    const ambiguousProduct = createProduct({
      id: "10530000000000",
      handle: "owner-product-no-026",
      title: "No.026",
    });
    const reconciliationReport = createReport({
      artworks: [
        createArtwork({
          artworkId: "artwork-026",
          artworkNumber: "026",
          productResults: [
            {
              productFamily: "print",
              proposedHandle: "joseph-laoutaris-print-no026",
              matchStatus: "manual_product_match",
              manualNumberMatches: [bookProduct, ambiguousProduct],
              conflicts: [],
              warnings: [],
            },
          ],
        }),
      ],
    });

    const report = buildCleanupReport({
      reconciliationReport,
      reconciliationInputPath: "reports/reconciliation.json",
      outputPath: "reports/cleanup.json",
      mode: "archive",
    });

    expect(report.summary).toMatchObject({
      candidatesFound: 2,
      productsTargeted: 0,
      productsRejected: 2,
      archiveAttempts: 0,
    });
    expect(report.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          handle: "the-complete-artwork-of-joseph-laoutaris",
          action: "rejected",
          error: expect.objectContaining({
            validationErrors: expect.arrayContaining([
              expect.objectContaining({ code: "book_product_rejected" }),
            ]),
          }),
        }),
        expect.objectContaining({
          handle: "owner-product-no-026",
          action: "rejected",
          error: expect.objectContaining({
            validationErrors: expect.arrayContaining([
              expect.objectContaining({
                code: "missing_original_print_family_evidence",
              }),
            ]),
          }),
        }),
      ])
    );
    expect(hasBlockingCleanupValidation(report)).toBe(true);
  });

  it("keeps dry-run local and refuses reports with Shopify query errors", () => {
    const printProduct = createProduct({
      id: "10538865787144",
      handle: "joseph-laoutaris-fine-art-print-no-035",
      title: "No.035, Limited Edition Print",
    });
    const report = buildCleanupReport({
      reconciliationReport: createReport({
        artworks: [
          createArtwork({
            artworkId: "artwork-035",
            artworkNumber: "035",
            productResults: [
              {
                productFamily: "print",
                proposedHandle: "joseph-laoutaris-print-no035",
                matchStatus: "manual_product_match",
                manualNumberMatches: [printProduct],
                conflicts: [],
                warnings: [],
              },
            ],
          }),
        ],
      }),
      reconciliationInputPath: "reports/reconciliation.json",
      outputPath: "reports/cleanup.json",
      mode: "dry-run",
    });

    expect(report.safety).toMatchObject({
      dryRun: true,
      shopifyMutationsAllowed: false,
    });
    expect(report.products[0]).toMatchObject({
      action: "would_archive_product",
      shopifyResponse: null,
      error: null,
    });
    expect(() =>
      buildCleanupReport({
        reconciliationReport: createReport({
          artworks: [],
          queryErrors: [{ message: "Shopify Admin GraphQL HTTP 500" }],
        }),
        reconciliationInputPath: "reports/reconciliation.json",
        outputPath: "reports/cleanup.json",
        mode: "dry-run",
      })
    ).toThrow("query errors");
  });

  it("uses productUpdate status ARCHIVED and never includes delete mutations", () => {
    expect(PRODUCT_ARCHIVE_MUTATION).toContain("productUpdate");
    expect(PRODUCT_ARCHIVE_MUTATION).not.toMatch(/productDelete|delete/i);
    expect(createArchiveMutationVariables("gid://shopify/Product/123")).toEqual({
      product: {
        id: "gid://shopify/Product/123",
        status: "ARCHIVED",
      },
    });
  });
});
