const {
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_BY_ARTWORK_METAFIELD_QUERY,
  PRODUCTS_BY_MANUAL_ARTWORK_NUMBER_QUERY,
  buildManualArtworkNumberSearchQuery,
  buildMetafieldSearchQuery,
  buildReconciliationReport,
  createAdminGraphqlUrl,
  hasBlockingReconciliationFindings,
  normalizeShopifyProduct,
  redactSensitiveText,
  validatePlanInput,
  validateRequiredEnv,
} = require("../../../scripts/reconcile-shopify-catalog-plan-helpers.cjs");

const SHOP_DOMAIN = "example.myshopify.com";

const createPlannedArtwork = ({
  artworkId,
  title = "Planned Artwork",
  products,
}) => ({
  artworkId,
  title,
  customMongodbArtworkId: artworkId,
  products,
});

const createPlannedProduct = ({ family, handle }) => ({
  productFamily: family,
  proposedHandle: handle,
});

const createShopifyProduct = ({
  id,
  handle,
  title = "Shopify Product",
  productType = "Original Artwork",
  tags = ["original"],
  customMongodbArtworkId = null,
}) =>
  normalizeShopifyProduct(
    {
      id: `gid://shopify/Product/${id}`,
      legacyResourceId: id,
      handle,
      title,
      productType,
      status: "DRAFT",
      tags,
      totalInventory: 1,
      metafield: customMongodbArtworkId
        ? {
            namespace: "custom",
            key: "mongodb_artwork_id",
            value: customMongodbArtworkId,
          }
        : null,
    },
    { shopDomain: SHOP_DOMAIN }
  );

describe("reconcile Shopify catalog plan helpers", () => {
  it("validates required env without exposing token values", () => {
    expect(() => validateRequiredEnv({})).toThrow(
      "Missing required Shopify Admin environment variables"
    );

    expect(() =>
      validateRequiredEnv({
        SHOPIFY_STORE_DOMAIN: "https://example.myshopify.com",
        SHOPIFY_ADMIN_API_VERSION: "2026-04",
        SHOPIFY_ADMIN_ACCESS_TOKEN: "shpat_secret",
      })
    ).toThrow("without protocol");

    expect(
      validateRequiredEnv({
        SHOPIFY_STORE_DOMAIN: SHOP_DOMAIN,
        SHOPIFY_ADMIN_API_VERSION: "2026-04",
        SHOPIFY_ADMIN_ACCESS_TOKEN: "shpat_secret",
      })
    ).toEqual({
      shopDomain: SHOP_DOMAIN,
      adminApiVersion: "2026-04",
      adminAccessToken: "shpat_secret",
    });
  });

  it("rejects dry-run plans that lack required reconciliation fields", () => {
    expect(() => validatePlanInput({})).toThrow("artworks array");
    expect(() =>
      validatePlanInput({
        artworks: [{ customMongodbArtworkId: "artwork-1" }],
      })
    ).toThrow("lacks products");
    expect(() =>
      validatePlanInput({
        artworks: [{ products: [] }],
      })
    ).toThrow("lacks customMongodbArtworkId");
    expect(() =>
      validatePlanInput({
        artworks: [
          {
            customMongodbArtworkId: "artwork-1",
            products: [{ productFamily: "original" }],
          },
        ],
      })
    ).toThrow("lacks proposedHandle");
  });

  it("constructs read-only Shopify Admin GraphQL lookups", () => {
    expect(createAdminGraphqlUrl({
      shopDomain: SHOP_DOMAIN,
      adminApiVersion: "2026-04",
    })).toBe("https://example.myshopify.com/admin/api/2026-04/graphql.json");
    expect(buildMetafieldSearchQuery("661fc617648efb163cffacee")).toBe(
      "metafields.custom.mongodb_artwork_id:661fc617648efb163cffacee"
    );
    expect(buildManualArtworkNumberSearchQuery({ normalized: "26", padded: "026" }))
      .toBe('no-026 OR no026 OR "No.026"');
    expect(PRODUCT_BY_HANDLE_QUERY).toContain("productByHandle");
    expect(PRODUCTS_BY_ARTWORK_METAFIELD_QUERY).toContain("products(first: 20");
    expect(PRODUCTS_BY_MANUAL_ARTWORK_NUMBER_QUERY).toContain(
      "products(first: 20"
    );
    expect(
      `${PRODUCT_BY_HANDLE_QUERY}\n${PRODUCTS_BY_ARTWORK_METAFIELD_QUERY}\n${PRODUCTS_BY_MANUAL_ARTWORK_NUMBER_QUERY}`
    ).not.toMatch(/\bmutation\b/i);
  });

  it("classifies exact, handle-only, metafield-only, and no-match products", () => {
    const plan = {
      artworks: [
        createPlannedArtwork({
          artworkId: "artwork-exact",
          products: [
            createPlannedProduct({
              family: "original",
              handle: "joseph-laoutaris-original-exact-00000001",
            }),
          ],
        }),
        createPlannedArtwork({
          artworkId: "artwork-handle",
          products: [
            createPlannedProduct({
              family: "print",
              handle: "joseph-laoutaris-print-handle-00000002",
            }),
          ],
        }),
        createPlannedArtwork({
          artworkId: "artwork-metafield",
          products: [
            createPlannedProduct({
              family: "original",
              handle: "joseph-laoutaris-original-new-00000003",
            }),
          ],
        }),
        createPlannedArtwork({
          artworkId: "artwork-none",
          products: [
            createPlannedProduct({
              family: "print",
              handle: "joseph-laoutaris-print-none-00000004",
            }),
          ],
        }),
      ],
    };
    const exactProduct = createShopifyProduct({
      id: "1001",
      handle: "joseph-laoutaris-original-exact-00000001",
      customMongodbArtworkId: "artwork-exact",
    });
    const handleOnlyProduct = createShopifyProduct({
      id: "1002",
      handle: "joseph-laoutaris-print-handle-00000002",
      productType: "Fine Art Print",
      tags: ["print", "fine-art-print"],
    });
    const metafieldOnlyProduct = createShopifyProduct({
      id: "1003",
      handle: "owner-preserved-original-handle",
      customMongodbArtworkId: "artwork-metafield",
    });

    const report = buildReconciliationReport({
      plan,
      handleLookups: {
        "joseph-laoutaris-original-exact-00000001": {
          product: exactProduct,
        },
        "joseph-laoutaris-print-handle-00000002": {
          product: handleOnlyProduct,
        },
        "joseph-laoutaris-original-new-00000003": { product: null },
        "joseph-laoutaris-print-none-00000004": { product: null },
      },
      metafieldLookups: {
        "artwork-exact": { products: [exactProduct] },
        "artwork-handle": { products: [] },
        "artwork-metafield": { products: [metafieldOnlyProduct] },
        "artwork-none": { products: [] },
      },
      source: {
        planInputPath: "reports/shopify-catalog-dry-run-plan.json",
        shopDomain: SHOP_DOMAIN,
        adminApiVersion: "2026-04",
      },
      generatedAt: "2026-05-28T00:00:00.000Z",
    });

    expect(report.summary).toMatchObject({
      artworksScanned: 4,
      plannedProductsScanned: 4,
      plannedProductsWithExactMatch: 1,
      plannedProductsWithHandleOnlyMatch: 1,
      plannedProductsWithMetafieldOnlyMatch: 1,
      plannedProductsWithNoMatch: 1,
      plannedProductsWithConflict: 0,
      queryErrorCount: 0,
      shopifyProductsMatched: 3,
    });
    expect(report.safety).toEqual({
      readOnly: true,
      shopifyMutationsAllowed: false,
      mongoWritesAllowed: false,
      cloudinaryWritesAllowed: false,
      tokensPersisted: false,
    });
    expect(report.artworks[2].products[0]).toMatchObject({
      matchStatus: "metafield_only_match",
      recommendedAction: "preserve_existing_manual_handle",
      metafieldMatches: [
        expect.objectContaining({ handle: "owner-preserved-original-handle" }),
      ],
    });
    expect(hasBlockingReconciliationFindings(report)).toBe(false);
  });

  it("classifies manual-review blockers and query errors", () => {
    const plan = {
      artworks: [
        createPlannedArtwork({
          artworkId: "artwork-conflict",
          products: [
            createPlannedProduct({
              family: "original",
              handle: "joseph-laoutaris-original-conflict-00000001",
            }),
          ],
        }),
        createPlannedArtwork({
          artworkId: "artwork-query-error",
          products: [
            createPlannedProduct({
              family: "print",
              handle: "joseph-laoutaris-print-error-00000002",
            }),
          ],
        }),
      ],
    };
    const handleConflict = createShopifyProduct({
      id: "2001",
      handle: "joseph-laoutaris-original-conflict-00000001",
      customMongodbArtworkId: "different-artwork",
    });
    const firstDuplicate = createShopifyProduct({
      id: "2002",
      handle: "joseph-laoutaris-original-duplicate-a",
      customMongodbArtworkId: "artwork-conflict",
    });
    const secondDuplicate = createShopifyProduct({
      id: "2003",
      handle: "joseph-laoutaris-original-duplicate-b",
      productType: "Original Artwork",
      tags: ["original"],
      customMongodbArtworkId: "artwork-conflict",
    });

    const report = buildReconciliationReport({
      plan,
      handleLookups: {
        "joseph-laoutaris-original-conflict-00000001": {
          product: handleConflict,
        },
        "joseph-laoutaris-print-error-00000002": {
          product: null,
          error: { message: "Shopify Admin GraphQL HTTP 500" },
        },
      },
      metafieldLookups: {
        "artwork-conflict": {
          products: [firstDuplicate, secondDuplicate],
        },
        "artwork-query-error": {
          products: [],
          error: { message: "Shopify Admin GraphQL errors: throttled" },
        },
      },
      source: {
        planInputPath: "reports/shopify-catalog-dry-run-plan.json",
        shopDomain: SHOP_DOMAIN,
        adminApiVersion: "2026-04",
      },
    });

    expect(report.summary).toMatchObject({
      plannedProductsWithConflict: 1,
      queryErrorCount: 2,
      duplicateShopifyProductsByArtworkId: 1,
      manualReviewCount: 2,
    });
    expect(report.artworks[0].products[0]).toMatchObject({
      matchStatus: "conflict",
      recommendedAction: "manual_review_required",
      conflicts: expect.arrayContaining([
        expect.objectContaining({ code: "handle_metafield_artwork_mismatch" }),
        expect.objectContaining({
          code: "duplicate_shopify_products_by_artwork_id",
        }),
      ]),
    });
    expect(report.queryErrors).toEqual([
      {
        lookupType: "handle",
        proposedHandle: "joseph-laoutaris-print-error-00000002",
        message: "Shopify Admin GraphQL HTTP 500",
      },
      {
        lookupType: "custom_mongodb_artwork_id",
        customMongodbArtworkId: "artwork-query-error",
        message: "Shopify Admin GraphQL errors: throttled",
      },
    ]);
    expect(hasBlockingReconciliationFindings(report)).toBe(true);
  });

  it("allows one original and one print to share the same artwork metafield", () => {
    const artworkId = "artwork-generated-pair";
    const original = createShopifyProduct({
      id: "2501",
      handle: "joseph-laoutaris-original-generated-pair",
      title: "No.001 - Original Artwork",
      productType: "Original Artwork",
      tags: ["original"],
      customMongodbArtworkId: artworkId,
    });
    const print = createShopifyProduct({
      id: "2502",
      handle: "joseph-laoutaris-print-generated-pair",
      title: "No.001 - Fine Art Print",
      productType: "Fine Art Print",
      tags: ["print", "fine-art-print"],
      customMongodbArtworkId: artworkId,
    });

    const report = buildReconciliationReport({
      plan: {
        artworks: [
          createPlannedArtwork({
            artworkId,
            title: "No.001",
            products: [
              createPlannedProduct({
                family: "original",
                handle: "joseph-laoutaris-original-generated-pair",
              }),
              createPlannedProduct({
                family: "print",
                handle: "joseph-laoutaris-print-generated-pair",
              }),
            ],
          }),
        ],
      },
      handleLookups: {
        "joseph-laoutaris-original-generated-pair": { product: original },
        "joseph-laoutaris-print-generated-pair": { product: print },
      },
      metafieldLookups: {
        [artworkId]: { products: [original, print] },
      },
      manualNumberLookups: {
        [artworkId]: { products: [original, print] },
      },
      source: {
        planInputPath: "reports/shopify-catalog-dry-run-plan.json",
        shopDomain: SHOP_DOMAIN,
        adminApiVersion: "2026-04",
      },
    });

    expect(report.summary).toMatchObject({
      plannedProductsWithExactMatch: 2,
      plannedProductsWithConflict: 0,
      duplicateShopifyProductsByArtworkId: 0,
      manualReviewCount: 0,
    });
    expect(report.artworks[0].conflicts).toEqual([]);
    expect(report.artworks[0].products).toEqual([
      expect.objectContaining({ matchStatus: "exact_match" }),
      expect.objectContaining({ matchStatus: "exact_match" }),
    ]);
    expect(hasBlockingReconciliationFindings(report)).toBe(false);
  });

  it("does not block exact generated matches when another artwork shares the same number", () => {
    const artworkId = "artwork-shared-number-a";
    const sameNumberArtworkId = "artwork-shared-number-b";
    const exactOriginal = createShopifyProduct({
      id: "2601",
      handle: "joseph-laoutaris-original-no205-artwork-a",
      title: "No.205 - Original Artwork",
      productType: "Original Artwork",
      tags: ["original"],
      customMongodbArtworkId: artworkId,
    });
    const otherOriginal = createShopifyProduct({
      id: "2602",
      handle: "joseph-laoutaris-original-no205-artwork-b",
      title: "No.205 - Original Artwork",
      productType: "Original Artwork",
      tags: ["original"],
      customMongodbArtworkId: sameNumberArtworkId,
    });

    const report = buildReconciliationReport({
      plan: {
        artworks: [
          createPlannedArtwork({
            artworkId,
            title: "No.205",
            products: [
              createPlannedProduct({
                family: "original",
                handle: "joseph-laoutaris-original-no205-artwork-a",
              }),
            ],
          }),
        ],
      },
      handleLookups: {
        "joseph-laoutaris-original-no205-artwork-a": {
          product: exactOriginal,
        },
      },
      metafieldLookups: {
        [artworkId]: { products: [exactOriginal] },
      },
      manualNumberLookups: {
        [artworkId]: { products: [exactOriginal, otherOriginal] },
      },
      source: {
        planInputPath: "reports/shopify-catalog-dry-run-plan.json",
        shopDomain: SHOP_DOMAIN,
        adminApiVersion: "2026-04",
      },
    });

    expect(report.summary).toMatchObject({
      plannedProductsWithExactMatch: 1,
      plannedProductsWithConflict: 0,
      manualReviewCount: 0,
    });
    expect(report.artworks[0].products[0]).toMatchObject({
      matchStatus: "exact_match",
      warnings: [
        expect.objectContaining({
          code: "manual_number_matches_other_artworks_ignored",
          count: 1,
        }),
      ],
    });
    expect(hasBlockingReconciliationFindings(report)).toBe(false);
  });

  it("ignores null or mismatched metafield lookup results and preserves clean manual number matches", () => {
    const artworkId = "661fcbca40f59e26cc761dde";
    const plan = {
      artworks: [
        createPlannedArtwork({
          artworkId,
          title: "No.026",
          products: [
            createPlannedProduct({
              family: "original",
              handle: "joseph-laoutaris-original-no026-cc761dde",
            }),
            createPlannedProduct({
              family: "print",
              handle: "joseph-laoutaris-print-no026-cc761dde",
            }),
          ],
        }),
      ],
    };
    const nullMetafieldProduct = createShopifyProduct({
      id: "3001",
      handle: "joseph-laoutaris-fine-art-print-no-026",
      title: "No.026, Limited Edition Print",
      productType: "",
      tags: [],
    });
    const mismatchedMetafieldProduct = createShopifyProduct({
      id: "3002",
      handle: "joseph-laoutaris-original-artwork-no-026",
      title: "No.026, Original Artwork",
      productType: "",
      tags: [],
      customMongodbArtworkId: "different-artwork",
    });

    const report = buildReconciliationReport({
      plan,
      handleLookups: {
        "joseph-laoutaris-original-no026-cc761dde": { product: null },
        "joseph-laoutaris-print-no026-cc761dde": { product: null },
      },
      metafieldLookups: {
        [artworkId]: {
          products: [nullMetafieldProduct, mismatchedMetafieldProduct],
        },
      },
      manualNumberLookups: {
        [artworkId]: {
          products: [nullMetafieldProduct],
        },
      },
      source: {
        planInputPath: "reports/shopify-catalog-dry-run-plan.json",
        shopDomain: SHOP_DOMAIN,
        adminApiVersion: "2026-04",
      },
    });

    expect(report.artworks[0]).toMatchObject({
      artworkNumber: "026",
      matchesByArtworkMetafield: [],
      warnings: [
        expect.objectContaining({
          code: "ignored_non_matching_metafield_lookup_results",
          count: 2,
        }),
      ],
    });
    expect(report.artworks[0].products[0]).toMatchObject({
      matchStatus: "no_match",
      recommendedAction: "safe_to_create_later",
      metafieldMatches: [],
      manualNumberMatches: [],
    });
    expect(report.artworks[0].products[1]).toMatchObject({
      matchStatus: "manual_product_match",
      recommendedAction: "preserve_existing_manual_product",
      metafieldMatches: [],
      manualNumberMatches: [
        expect.objectContaining({
          handle: "joseph-laoutaris-fine-art-print-no-026",
          customMongodbArtworkId: null,
        }),
      ],
    });
    expect(report.summary).toMatchObject({
      plannedProductsWithManualProductMatch: 1,
      plannedProductsWithNoMatch: 1,
      plannedProductsWithConflict: 0,
      shopifyProductsMatched: 1,
    });
  });

  it("requires manual review for ambiguous or multiple manual number matches", () => {
    const artworkId = "67c5ca8583068dd97c8c638f";
    const firstOriginal = createShopifyProduct({
      id: "4001",
      handle: "joseph-laoutaris-original-artwork-no-043",
      title: "No.043, Original Artwork",
      productType: "",
      tags: [],
    });
    const secondOriginal = createShopifyProduct({
      id: "4002",
      handle: "owner-original-no-043",
      title: "No.043, Original Artwork",
      productType: "Original Artwork",
      tags: [],
    });
    const ambiguousFamily = createShopifyProduct({
      id: "4003",
      handle: "joseph-laoutaris-product-no-043",
      title: "No.043",
      productType: "",
      tags: [],
    });

    const report = buildReconciliationReport({
      plan: {
        artworks: [
          createPlannedArtwork({
            artworkId,
            title: "No.043",
            products: [
              createPlannedProduct({
                family: "original",
                handle: "joseph-laoutaris-original-no043-7c8c638f",
              }),
            ],
          }),
        ],
      },
      handleLookups: {
        "joseph-laoutaris-original-no043-7c8c638f": { product: null },
      },
      metafieldLookups: {
        [artworkId]: { products: [] },
      },
      manualNumberLookups: {
        [artworkId]: {
          products: [firstOriginal, secondOriginal, ambiguousFamily],
        },
      },
      source: {
        planInputPath: "reports/shopify-catalog-dry-run-plan.json",
        shopDomain: SHOP_DOMAIN,
        adminApiVersion: "2026-04",
      },
    });

    expect(report.artworks[0].products[0]).toMatchObject({
      matchStatus: "conflict",
      recommendedAction: "manual_review_required",
      conflicts: expect.arrayContaining([
        expect.objectContaining({
          code: "multiple_manual_number_product_matches",
        }),
        expect.objectContaining({
          code: "ambiguous_manual_number_product_family",
        }),
      ]),
    });
    expect(report.summary).toMatchObject({
      plannedProductsWithConflict: 1,
      manualReviewCount: 1,
    });
    expect(hasBlockingReconciliationFindings(report)).toBe(true);
  });

  it("keeps no-number artworks safe to create only when no possible match exists", () => {
    const artworkId = "artwork-without-number";
    const report = buildReconciliationReport({
      plan: {
        artworks: [
          createPlannedArtwork({
            artworkId,
            title: "Untitled",
            products: [
              createPlannedProduct({
                family: "print",
                handle: "joseph-laoutaris-print-untitled-00000001",
              }),
            ],
          }),
        ],
      },
      handleLookups: {
        "joseph-laoutaris-print-untitled-00000001": { product: null },
      },
      metafieldLookups: {
        [artworkId]: { products: [] },
      },
      manualNumberLookups: {
        [artworkId]: { products: [] },
      },
      source: {
        planInputPath: "reports/shopify-catalog-dry-run-plan.json",
        shopDomain: SHOP_DOMAIN,
        adminApiVersion: "2026-04",
      },
    });

    expect(report.artworks[0]).toMatchObject({
      artworkNumber: null,
      matchesByManualArtworkNumber: [],
    });
    expect(report.artworks[0].products[0]).toMatchObject({
      matchStatus: "no_match",
      recommendedAction: "safe_to_create_later",
      warnings: [
        expect.objectContaining({
          code: "missing_artwork_number_for_manual_match",
        }),
      ],
    });
  });

  it("redacts access-token-like values before logging or reporting errors", () => {
    const token = "shpat_thisValueMustNotLeak";
    const redacted = redactSensitiveText(
      `Request failed with X-Shopify-Access-Token: ${token} and access_token=${token}`,
      [token]
    );

    expect(redacted).not.toContain(token);
    expect(redacted).toContain("[REDACTED]");
  });
});
