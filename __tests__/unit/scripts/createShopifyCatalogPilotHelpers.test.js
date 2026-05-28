const {
  CREATE_PILOT_CONFIRMATION,
  PRODUCT_SET_MUTATION,
  applyProductSetSuccess,
  buildPilotCreateReport,
  hasPilotCreateFailures,
  markRemainingProductsSkipped,
  parseArgs,
  redactSensitiveText,
  validateApprovalInput,
  validateExecutionOptions,
  validateRequiredEnv,
} = require("../../../scripts/create-shopify-catalog-pilot-helpers.cjs");

const SHOP_DOMAIN = "example.myshopify.com";
const LOCATION_ID = "gid://shopify/Location/415211365";

const artworkIds = [
  "665544332211009988776651",
  "665544332211009988776652",
  "665544332211009988776653",
  "665544332211009988776654",
  "665544332211009988776655",
];

const createPlanProduct = ({ artworkId, family }) => ({
  productFamily: family,
  proposedHandle: `joseph-laoutaris-${family}-planned-${artworkId.slice(-8)}`,
  productType: family === "original" ? "Original Artwork" : "Fine Art Print",
  tags:
    family === "original"
      ? ["original", "painting", "archive-artwork"]
      : ["print", "fine-art-print", "archive-artwork"],
  inventoryQuantity: family === "original" ? 1 : 50,
  inventoryPolicy: "deny",
  warnings: [],
});

const createPlan = () => ({
  generatedAt: "2026-05-28T00:00:00.000Z",
  mode: "dry-run",
  artworks: artworkIds.map((artworkId, index) => ({
    artworkId,
    customMongodbArtworkId: artworkId,
    title: `No.00${index + 1}`,
    imageUrlPresent: true,
    imageUrl: `https://res.cloudinary.com/demo/${artworkId}.jpg`,
    products: [
      createPlanProduct({ artworkId, family: "original" }),
      createPlanProduct({ artworkId, family: "print" }),
    ],
  })),
});

const createReconciliation = (plan = createPlan()) => ({
  generatedAt: "2026-05-28T01:00:00.000Z",
  mode: "read_only_shopify_reconciliation",
  safety: {
    readOnly: true,
    shopifyMutationsAllowed: false,
    mongoWritesAllowed: false,
    cloudinaryWritesAllowed: false,
    tokensPersisted: false,
  },
  source: {
    planInputPath: "reports/shopify-catalog-dry-run-plan.json",
    shopDomain: SHOP_DOMAIN,
    adminApiVersion: "2026-04",
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

const createApproval = (overridesByArtworkId = {}) => ({
  inventoryLocationId: LOCATION_ID,
  inventoryLocationName: "Main studio",
  artworks: artworkIds.map((artworkId, index) => ({
    mongodbArtworkId: artworkId,
    title: `No.00${index + 1}`,
    originalPrice: `${1000 + index}.00`,
    printPrice: "75.00",
    status: "DRAFT",
    mongoDbLinking: false,
    printEditionQuantity: index === 0 ? undefined : 50,
    ...(overridesByArtworkId[artworkId] ?? {}),
  })),
});

describe("create Shopify catalog pilot helpers", () => {
  it("requires exact confirmation and pinned write-products environment", () => {
    expect(parseArgs([
      "--plan=reports/plan.json",
      "--reconciliation=reports/reconciliation.json",
      "--approval=reports/approval.json",
      "--output=reports/output.json",
      `--confirm=${CREATE_PILOT_CONFIRMATION}`,
    ])).toEqual({
      plan: "reports/plan.json",
      reconciliation: "reports/reconciliation.json",
      approval: "reports/approval.json",
      output: "reports/output.json",
      confirm: CREATE_PILOT_CONFIRMATION,
    });

    expect(() => validateExecutionOptions(parseArgs([]))).toThrow(
      `--confirm=${CREATE_PILOT_CONFIRMATION}`
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

  it("requires exactly five draft approvals with prices, location, and MongoDB linking disabled", () => {
    expect(() => validateApprovalInput({ artworks: [] })).toThrow(
      "exactly 5 artworks"
    );
    expect(() =>
      validateApprovalInput({
        artworks: createApproval().artworks.slice(0, 4),
      })
    ).toThrow("exactly 5 artworks");
    expect(() =>
      validateApprovalInput(
        createApproval({
          [artworkIds[0]]: { status: "ACTIVE" },
        })
      )
    ).toThrow("DRAFT");
    expect(() =>
      validateApprovalInput(
        createApproval({
          [artworkIds[0]]: { originalPrice: "" },
        })
      )
    ).toThrow("missing originalPrice");
    expect(() =>
      validateApprovalInput(
        createApproval({
          [artworkIds[0]]: { title: "" },
        })
      )
    ).toThrow("artwork title");
    expect(() =>
      validateApprovalInput(
        createApproval({
          [artworkIds[0]]: { mongoDbLinking: true },
        })
      )
    ).toThrow("MongoDB linking disabled");
    expect(() =>
      validateApprovalInput({
        artworks: createApproval().artworks.map((artwork) => ({
          ...artwork,
          inventoryLocationId: "",
        })),
      })
    ).toThrow("inventory location GID");

    expect(validateApprovalInput(createApproval()).artworks).toHaveLength(5);
  });

  it("builds a draft-only report and productSet payload for five originals and five unframed prints", () => {
    const plan = createPlan();
    const report = buildPilotCreateReport({
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
      generatedAt: "2026-05-28T02:00:00.000Z",
    });

    expect(report).toMatchObject({
      generatedAt: "2026-05-28T02:00:00.000Z",
      mode: "shopify_catalog_pilot_creation",
      safety: {
        confirmationPresent: true,
        approvedArtworkCountRequired: 5,
        maxProductsToCreate: 10,
        draftOnly: true,
        publicationWritesAllowed: false,
        mongoWritesAllowed: false,
        cloudinaryWritesAllowed: false,
        tokensPersisted: false,
      },
      summary: {
        approvedArtworks: 5,
        productsPlanned: 10,
        productsPending: 10,
      },
    });
    expect(report.selectedArtworks).toHaveLength(5);
    expect(report.products).toHaveLength(10);

    const original = report.products.find(
      (product) => product.productFamily === "original"
    );
    const print = report.products.find(
      (product) => product.productFamily === "print"
    );

    expect(original).toMatchObject({
      status: "DRAFT",
      inventoryQuantity: 1,
      inventoryPolicy: "DENY",
      printVariantOption: null,
    });
    expect(original.shopifyMutation.variables.productSet).toMatchObject({
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
    expect(print).toMatchObject({
      status: "DRAFT",
      inventoryQuantity: 50,
      printVariantOption: {
        name: "Frame package",
        value: "Unframed",
      },
    });
    expect(print.shopifyMutation.variables.productSet).toMatchObject({
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
          price: "75.00",
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
      files: [
        expect.objectContaining({
          originalSource: expect.stringContaining("https://res.cloudinary.com/"),
          contentType: "IMAGE",
        }),
      ],
      metafields: [
        expect.objectContaining({
          namespace: "custom",
          key: "mongodb_artwork_id",
          value: print.artworkId,
        }),
      ],
    });
    expect(JSON.stringify(report)).not.toMatch(/shpat_|access_token/i);
    expect(PRODUCT_SET_MUTATION).toContain("productSet");
    expect(PRODUCT_SET_MUTATION).not.toMatch(/publish|publication|productDelete|ARCHIVED/i);
  });

  it("refuses selected rows with existing matches, conflicts, query errors, or missing plan image URLs", () => {
    const plan = createPlan();
    const reconciliationWithMatch = createReconciliation(plan);
    reconciliationWithMatch.artworks[0].products[0] = {
      ...reconciliationWithMatch.artworks[0].products[0],
      matchStatus: "handle_only_match",
      recommendedAction: "preserve_existing_product",
      handleMatch: {
        id: "gid://shopify/Product/123",
        handle: plan.artworks[0].products[0].proposedHandle,
      },
    };

    expect(() =>
      buildPilotCreateReport({
        plan,
        reconciliation: reconciliationWithMatch,
        approval: createApproval(),
        source: {},
      })
    ).toThrow("not clean to create");

    const reconciliationWithQueryError = createReconciliation(plan);
    reconciliationWithQueryError.artworks[0].products[0].warnings = [
      { code: "shopify_query_error", message: "throttled" },
    ];

    expect(() =>
      buildPilotCreateReport({
        plan,
        reconciliation: reconciliationWithQueryError,
        approval: createApproval(),
        source: {},
      })
    ).toThrow("query errors");

    const planWithoutImage = createPlan();
    planWithoutImage.artworks[0].imageUrl = null;

    expect(() =>
      buildPilotCreateReport({
        plan: planWithoutImage,
        reconciliation: createReconciliation(planWithoutImage),
        approval: createApproval(),
        source: {},
      })
    ).toThrow("lacks an image URL");
  });

  it("updates report entries for Shopify success, user errors, and stop-after-failure behavior", () => {
    const plan = createPlan();
    const report = buildPilotCreateReport({
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
            title: "No.001, Original Artwork",
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
                  alt: "No.001, Original Artwork",
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
      userErrors: [
        {
          field: ["handle"],
          message: "Handle has already been taken",
        },
      ],
    });
    expect(report.summary).toMatchObject({
      productsCreated: 1,
      productsFailed: 1,
      productsSkipped: 8,
      userErrorCount: 1,
    });
    expect(hasPilotCreateFailures(report)).toBe(true);
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
