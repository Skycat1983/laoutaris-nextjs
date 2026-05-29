const {
  CREATE_DRAFTS_CONFIRMATION,
  PRODUCT_SET_MUTATION,
  applyProductSetSuccess,
  buildDraftCreateReport,
  hasDraftCreateFailures,
  markRemainingProductsSkipped,
  parseArgs,
  redactSensitiveText,
  validateApprovalInput,
  validateExecutionOptions,
  validateRequiredEnv,
} = require("../../../scripts/create-shopify-catalog-drafts-helpers.cjs");

const SHOP_DOMAIN = "example.myshopify.com";
const LOCATION_ID = "gid://shopify/Location/415211365";

const artworkIds = ["665544332211009988776651", "665544332211009988776652"];

const createMetafields = (artworkId, title) => [
  {
    namespace: "custom",
    key: "mongodb_artwork_id",
    type: "single_line_text_field",
    value: artworkId,
  },
  {
    namespace: "custom",
    key: "artwork_title",
    type: "single_line_text_field",
    value: title,
  },
  {
    namespace: "custom",
    key: "artwork_featured",
    type: "boolean",
    value: false,
  },
  {
    namespace: "custom",
    key: "archive_image_width",
    type: "number_integer",
    value: 1200,
  },
];

const createPlanProduct = ({ artworkId, title, family }) => ({
  productFamily: family,
  proposedHandle: `joseph-laoutaris-${family}-planned-${artworkId.slice(-8)}`,
  title:
    family === "original"
      ? `${title} - Original Artwork`
      : `${title} - Fine Art Print`,
  vendor: "Joseph Laoutaris",
  productType: family === "original" ? "Original Artwork" : "Fine Art Print",
  tags:
    family === "original"
      ? ["archive-artwork", "original", "painting"]
      : ["archive-artwork", "print", "fine-art-print"],
  inventoryQuantity: family === "original" ? 1 : 50,
  inventoryPolicy: "deny",
  status: "DRAFT",
  media: [
    {
      sourceUrl: `https://res.cloudinary.com/demo/${artworkId}.jpg`,
      alt: `${title} ${family}`,
    },
  ],
  variants:
    family === "original"
      ? [{ title: "Default Title", inventoryQuantity: 1, inventoryPolicy: "deny" }]
      : [
          {
            optionName: "Frame package",
            optionValue: "Unframed",
            title: "Unframed",
            inventoryQuantity: 50,
            inventoryPolicy: "deny",
          },
        ],
  metafields: createMetafields(artworkId, title),
  warnings: [],
});

const createPlan = () => ({
  generatedAt: "2026-05-29T00:00:00.000Z",
  mode: "shopify_catalog_dry_run",
  summary: {
    artworksScanned: artworkIds.length,
    originalProductsPlanned: artworkIds.length,
    printProductsPlanned: artworkIds.length,
  },
  artworks: artworkIds.map((artworkId, index) => {
    const title = `No.00${index + 1}`;

    return {
      artworkId,
      customMongodbArtworkId: artworkId,
      title,
      imageUrlPresent: true,
      imageUrl: `https://res.cloudinary.com/demo/${artworkId}.jpg`,
      warnings: [],
      products: [
        createPlanProduct({ artworkId, title, family: "original" }),
        createPlanProduct({ artworkId, title, family: "print" }),
      ],
    };
  }),
});

const createReconciliation = (plan = createPlan()) => ({
  generatedAt: "2026-05-29T01:00:00.000Z",
  mode: "read_only_shopify_reconciliation",
  safety: {
    readOnly: true,
    shopifyMutationsAllowed: false,
    mongoWritesAllowed: false,
    cloudinaryWritesAllowed: false,
    tokensPersisted: false,
  },
  summary: {
    plannedProductsWithConflict: 0,
    queryErrorCount: 0,
    manualReviewCount: 0,
  },
  artworks: plan.artworks.map((artwork) => ({
    artworkId: artwork.artworkId,
    customMongodbArtworkId: artwork.customMongodbArtworkId,
    title: artwork.title,
    products: artwork.products.map((product) => ({
      productFamily: product.productFamily,
      proposedHandle: product.proposedHandle,
      matchStatus: "no_match",
      recommendedAction: "safe_to_create_later",
      handleMatch: null,
      metafieldMatches: [],
      manualNumberMatches: [],
      conflicts: [],
      warnings: [],
    })),
  })),
  queryErrors: [],
});

const createApproval = (overrides = {}) => ({
  fullCatalogApproval: true,
  approvedScope: "all_planned_no_match_products",
  productStatus: "DRAFT",
  mongoDbLinking: "none",
  originalPrice: "1000.00",
  printPrice: "100.00",
  printEditionQuantity: 50,
  inventoryLocationId: LOCATION_ID,
  inventoryLocationName: "Main studio",
  expectedArtworkCount: artworkIds.length,
  expectedProductCount: artworkIds.length * 2,
  ...overrides,
});

describe("create Shopify full catalog draft helpers", () => {
  it("requires exact confirmation and pinned Shopify Admin environment", () => {
    expect(
      parseArgs([
        "--plan=reports/plan.json",
        "--reconciliation=reports/reconciliation.json",
        "--approval=reports/approval.json",
        "--output=reports/output.json",
        `--confirm=${CREATE_DRAFTS_CONFIRMATION}`,
      ])
    ).toEqual({
      plan: "reports/plan.json",
      reconciliation: "reports/reconciliation.json",
      approval: "reports/approval.json",
      output: "reports/output.json",
      confirm: CREATE_DRAFTS_CONFIRMATION,
    });

    expect(() => validateExecutionOptions(parseArgs([]))).toThrow(
      `--confirm=${CREATE_DRAFTS_CONFIRMATION}`
    );
    expect(() =>
      validateRequiredEnv({
        SHOPIFY_STORE_DOMAIN: "https://example.myshopify.com",
        SHOPIFY_ADMIN_API_VERSION: "2026-04",
        SHOPIFY_ADMIN_ACCESS_TOKEN: "shpat_secret",
      })
    ).toThrow("without protocol");
    expect(() =>
      validateRequiredEnv({
        SHOPIFY_STORE_DOMAIN: SHOP_DOMAIN,
        SHOPIFY_ADMIN_API_VERSION: "2026-01",
        SHOPIFY_ADMIN_ACCESS_TOKEN: "shpat_secret",
      })
    ).toThrow("must be 2026-04");
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

  it("requires full-catalog draft approval with prices, location, and MongoDB linking disabled", () => {
    expect(() => validateApprovalInput({})).toThrow("all planned no-match");
    expect(() =>
      validateApprovalInput(createApproval({ productStatus: "ACTIVE" }))
    ).toThrow("DRAFT");
    expect(() =>
      validateApprovalInput(createApproval({ originalPrice: "" }))
    ).toThrow("missing originalPrice");
    expect(() =>
      validateApprovalInput(createApproval({ mongoDbLinking: true }))
    ).toThrow("MongoDB linking disabled");
    expect(() =>
      validateApprovalInput(createApproval({ inventoryLocationId: "" }))
    ).toThrow("inventory location GID");

    expect(validateApprovalInput(createApproval())).toMatchObject({
      fullCatalogApproval: true,
      productStatus: "DRAFT",
      mongoDbLinking: "none",
      originalPrice: "1000.00",
      printPrice: "100.00",
      printEditionQuantity: 50,
    });
  });

  it("builds a draft-only full catalog report and productSet payloads", () => {
    const plan = createPlan();
    const report = buildDraftCreateReport({
      plan,
      reconciliation: createReconciliation(plan),
      approval: createApproval(),
      source: {
        planInputPath: "reports/plan.json",
        reconciliationInputPath: "reports/reconciliation.json",
        approvalInputPath: "reports/approval.json",
        outputPath: "reports/output.json",
        shopDomain: SHOP_DOMAIN,
        adminApiVersion: "2026-04",
      },
      generatedAt: "2026-05-29T02:00:00.000Z",
    });

    expect(report).toMatchObject({
      generatedAt: "2026-05-29T02:00:00.000Z",
      mode: "shopify_catalog_full_draft_creation",
      safety: {
        confirmationPresent: true,
        approvedScope: "all_planned_no_match_products",
        approvedArtworkCount: 2,
        maxProductsToCreate: 4,
        draftOnly: true,
        publicationWritesAllowed: false,
        mongoWritesAllowed: false,
        cloudinaryWritesAllowed: false,
        tokensPersisted: false,
      },
      summary: {
        approvedArtworks: 2,
        productsPlanned: 4,
        productsPending: 4,
      },
    });
    expect(report.selectedArtworks).toHaveLength(2);
    expect(report.products).toHaveLength(4);

    const original = report.products.find(
      (product) => product.productFamily === "original"
    );
    const print = report.products.find(
      (product) => product.productFamily === "print"
    );

    expect(original.shopifyMutation.variables.productSet).toMatchObject({
      title: "No.001 - Original Artwork",
      vendor: "Joseph Laoutaris",
      status: "DRAFT",
      productType: "Original Artwork",
      handle: original.proposedHandle,
      variants: [
        expect.objectContaining({
          price: "1000.00",
          inventoryPolicy: "DENY",
          inventoryQuantities: [
            {
              locationId: LOCATION_ID,
              name: "available",
              quantity: 1,
            },
          ],
        }),
      ],
    });
    expect(print.shopifyMutation.variables.productSet).toMatchObject({
      title: "No.001 - Fine Art Print",
      vendor: "Joseph Laoutaris",
      status: "DRAFT",
      productType: "Fine Art Print",
      productOptions: [
        {
          name: "Frame package",
          position: 1,
          values: [{ name: "Unframed" }],
        },
      ],
      variants: [
        expect.objectContaining({
          price: "100.00",
          optionValues: [{ optionName: "Frame package", name: "Unframed" }],
          inventoryQuantities: [
            {
              locationId: LOCATION_ID,
              name: "available",
              quantity: 50,
            },
          ],
        }),
      ],
      metafields: expect.arrayContaining([
        expect.objectContaining({
          namespace: "custom",
          key: "mongodb_artwork_id",
          value: print.artworkId,
        }),
        expect.objectContaining({
          namespace: "custom",
          key: "archive_image_width",
          value: "1200",
        }),
      ]),
    });
    expect(JSON.stringify(report)).not.toMatch(/shpat_|access_token/i);
    expect(PRODUCT_SET_MUTATION).toContain("productSet");
    expect(PRODUCT_SET_MUTATION).not.toMatch(/publish|publication|productDelete|ARCHIVED/i);
  });

  it("refuses dirty reconciliation, stale approval counts, existing matches, and invalid images", () => {
    const plan = createPlan();
    const reconciliationWithQueryError = createReconciliation(plan);
    reconciliationWithQueryError.summary.queryErrorCount = 1;

    expect(() =>
      buildDraftCreateReport({
        plan,
        reconciliation: reconciliationWithQueryError,
        approval: createApproval(),
        source: {},
      })
    ).toThrow("query errors");

    expect(() =>
      buildDraftCreateReport({
        plan,
        reconciliation: createReconciliation(plan),
        approval: createApproval({ expectedProductCount: 6 }),
        source: {},
      })
    ).toThrow("expected product count");

    const reconciliationWithMatch = createReconciliation(plan);
    reconciliationWithMatch.artworks[0].products[0] = {
      ...reconciliationWithMatch.artworks[0].products[0],
      matchStatus: "handle_only_match",
      recommendedAction: "preserve_existing_product",
      handleMatch: { id: "gid://shopify/Product/123" },
    };

    expect(() =>
      buildDraftCreateReport({
        plan,
        reconciliation: reconciliationWithMatch,
        approval: createApproval(),
        source: {},
      })
    ).toThrow("not clean to create");

    const planWithInvalidImage = createPlan();
    planWithInvalidImage.artworks[0].products[0].media[0].sourceUrl =
      "not-a-url";

    expect(() =>
      buildDraftCreateReport({
        plan: planWithInvalidImage,
        reconciliation: createReconciliation(planWithInvalidImage),
        approval: createApproval(),
        source: {},
      })
    ).toThrow("valid image URL");
  });

  it("updates report entries for Shopify success, user errors, and stop-after-failure behavior", () => {
    const plan = createPlan();
    const report = buildDraftCreateReport({
      plan,
      reconciliation: createReconciliation(plan),
      approval: createApproval(),
      source: { shopDomain: SHOP_DOMAIN, adminApiVersion: "2026-04" },
    });
    const firstEntry = report.products[0];

    expect(
      applyProductSetSuccess({
        report,
        productIndex: 0,
        shopDomain: SHOP_DOMAIN,
        payload: {
          product: {
            id: "gid://shopify/Product/1072481936",
            legacyResourceId: "1072481936",
            handle: firstEntry.proposedHandle,
            title: firstEntry.title,
            status: "DRAFT",
            productType: "Original Artwork",
            totalInventory: 1,
            metafield: {
              namespace: "custom",
              key: "mongodb_artwork_id",
              value: firstEntry.artworkId,
            },
            media: {
              nodes: [
                {
                  id: "gid://shopify/MediaImage/1",
                  alt: firstEntry.title,
                  mediaContentType: "IMAGE",
                  status: "UPLOADED",
                },
              ],
            },
            variants: {
              nodes: [
                {
                  id: "gid://shopify/ProductVariant/1",
                  title: "Default Title",
                  price: "1000.00",
                  inventoryQuantity: 1,
                  inventoryPolicy: "DENY",
                  selectedOptions: [{ name: "Title", value: "Default Title" }],
                },
              ],
            },
          },
          userErrors: [],
        },
      })
    ).toBe(true);
    expect(report.products[0]).toMatchObject({
      action: "created",
      shopifyResult: {
        legacyResourceId: "1072481936",
        status: "DRAFT",
        adminUrl: "https://example.myshopify.com/admin/products/1072481936",
      },
      metafieldResult: {
        matchesExpected: true,
      },
    });

    expect(
      applyProductSetSuccess({
        report,
        productIndex: 1,
        shopDomain: SHOP_DOMAIN,
        payload: {
          product: null,
          userErrors: [{ field: ["handle"], message: "Handle has already been taken" }],
        },
      })
    ).toBe(false);
    markRemainingProductsSkipped(report, 2);

    expect(report.products[1]).toMatchObject({
      action: "create_failed",
      error: { code: "shopify_user_errors" },
    });
    expect(report.summary).toMatchObject({
      productsCreated: 1,
      productsFailed: 1,
      productsSkipped: 2,
      userErrorCount: 1,
    });
    expect(hasDraftCreateFailures(report)).toBe(true);
  });

  it("redacts Shopify Admin token values from failure messages", () => {
    const token = "shpat_thisValueMustNotLeak";
    const redacted = redactSensitiveText(
      `Request failed with X-Shopify-Access-Token: ${token} and access_token=${token}`,
      [token]
    );

    expect(redacted).not.toContain(token);
    expect(redacted).toContain("[REDACTED]");
  });
});
