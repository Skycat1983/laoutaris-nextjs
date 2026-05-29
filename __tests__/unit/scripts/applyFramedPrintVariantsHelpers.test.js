const {
  APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION,
  buildFramedPrintVariantWriteReport,
  createSafetySummary,
  parseArgs,
} = require("../../../scripts/apply-framed-print-variants-helpers.cjs");

const createTarget = ({
  framePackage = "Black wood",
  frameProfileId = "black_wood",
  mat = "No mat",
  matProfileId = "none",
  expectedPrice = "159.88",
  recommendedAction = "create_missing_variant",
} = {}) => ({
  framePackage,
  frameProfileId,
  mat,
  matProfileId,
  expectedPrice,
  currencyCode: "GBP",
  measurement: {
    width: 3504,
    height: 2310,
    unit: "px",
    source: "pixel_ratio_fallback",
  },
  geometry: {
    framePerimeter: 11628,
    matArea: mat === "No mat" ? 0 : 2296320,
  },
  pricing: {
    finalDraftPrice: expectedPrice,
  },
  recommendedAction,
  matchedCurrentVariant:
    recommendedAction === "preserve_existing_variant"
      ? { id: "gid://shopify/ProductVariant/1", price: "100.00" }
      : null,
  warnings: [],
});

const createProduct = ({ hasMatOption = false, targets } = {}) => ({
  artworkId: "artwork-1",
  artworkTitle: "No.001",
  artworkNumber: "001",
  selectedProduct: {
    gid: "gid://shopify/Product/111",
    productId: "111",
    handle: "joseph-laoutaris-print-no001",
  },
  currentShopifyProduct: {
    id: "gid://shopify/Product/111",
    legacyResourceId: "111",
    handle: "joseph-laoutaris-print-no001",
    status: "ACTIVE",
    options: [
      {
        id: "gid://shopify/ProductOption/1",
        name: "Frame package",
        values: ["Unframed"],
      },
      ...(hasMatOption
        ? [
            {
              id: "gid://shopify/ProductOption/2",
              name: "Mat",
              values: ["No mat", "White mat"],
            },
          ]
        : []),
    ],
  },
  approvedTargetVariants:
    targets ??
    [
      createTarget({
        framePackage: "Unframed",
        frameProfileId: "unframed",
        mat: "No mat",
        matProfileId: "none",
        expectedPrice: "100.00",
        recommendedAction: "preserve_existing_variant",
      }),
      createTarget(),
      createTarget({
        framePackage: "Black wood",
        frameProfileId: "black_wood",
        mat: "White mat",
        matProfileId: "white_small",
        expectedPrice: "183.18",
      }),
    ],
  warnings: [],
});

const createPlan = ({ summaryOverrides = {}, products = [createProduct()] } = {}) => ({
  mode: "read_only_framed_print_variant_plan",
  safety: {
    readOnly: true,
  },
  ownerApprovalSnapshot: {
    approvedFor: "read_only_variant_planning_only",
  },
  approvedMatrix: [],
  summary: {
    selectedPrintProducts: products.length,
    createMissingVariant: products.reduce(
      (count, product) =>
        count +
        product.approvedTargetVariants.filter(
          (target) => target.recommendedAction === "create_missing_variant"
        ).length,
      0
    ),
    manualReview: 0,
    queryErrorCount: 0,
    missingFormulaRows: 0,
    missingShopifyProductIds: 0,
    duplicateVariantCombinationWarnings: 0,
    ...summaryOverrides,
  },
  products,
});

describe("apply framed print variants helpers", () => {
  it("parses plan mode defaults and write confirmation", () => {
    expect(parseArgs([])).toMatchObject({
      input: "reports/framed-print-variant-plan.json",
      output: "reports/framed-print-variant-write-report.json",
      mode: "plan",
    });
    expect(
      parseArgs([
        "--input=reports/input.json",
        "--output=reports/output.json",
        "--mode=write",
        `--confirm=${APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION}`,
      ])
    ).toMatchObject({
      input: "reports/input.json",
      output: "reports/output.json",
      mode: "write",
      confirm: APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION,
    });
  });

  it("rejects write mode without exact confirmation", () => {
    expect(() => parseArgs(["--mode=write"])).toThrow(
      APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION
    );
  });

  it("builds a local write plan that creates Mat option before missing variants", () => {
    const report = buildFramedPrintVariantWriteReport({
      plan: createPlan(),
      options: { mode: "plan", confirm: null },
      source: {},
      generatedAt: "2026-05-29T00:00:00.000Z",
    });

    expect(report.safety).toMatchObject({
      requestedMode: "plan",
      shopifyMutationsAllowed: false,
      shopifyVariantCreatesAllowed: false,
      shopifyOptionMutationsAllowed: false,
      shopifyPriceWritesAllowed: false,
    });
    expect(report.summary).toMatchObject({
      productsPlanned: 1,
      optionCreateMutationsPlanned: 1,
      variantsToCreate: 2,
      preservedExistingVariants: 1,
    });
    expect(report.products[0].optionMutation).toMatchObject({
      mutation: "productOptionsCreate",
      variantStrategy: "LEAVE_AS_IS",
    });
    expect(report.products[0].createVariantTargets[0].mutationInput).toMatchObject({
      price: "159.88",
      inventoryPolicy: "DENY",
      optionValues: [
        {
          name: "Black wood",
          optionId: "gid://shopify/ProductOption/1",
        },
        {
          name: "No mat",
          optionId: null,
        },
      ],
    });
  });

  it("uses an existing Mat option when present", () => {
    const report = buildFramedPrintVariantWriteReport({
      plan: createPlan({ products: [createProduct({ hasMatOption: true })] }),
      options: { mode: "plan", confirm: null },
      source: {},
    });

    expect(report.summary.optionCreateMutationsPlanned).toBe(0);
    expect(
      report.products[0].createVariantTargets[0].mutationInput.optionValues[1]
    ).toEqual({
      name: "No mat",
      optionId: "gid://shopify/ProductOption/2",
    });
  });

  it("rejects plans with manual review blockers", () => {
    expect(() =>
      buildFramedPrintVariantWriteReport({
        plan: createPlan({ summaryOverrides: { manualReview: 1 } }),
        options: { mode: "plan", confirm: null },
        source: {},
      })
    ).toThrow("manual-review rows");
  });

  it("marks write mode as mutation-capable only behind confirmation", () => {
    const safety = createSafetySummary({
      mode: "write",
      confirm: APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION,
    });

    expect(safety).toMatchObject({
      requestedMode: "write",
      confirmationPresent: true,
      shopifyMutationsAllowed: true,
      shopifyVariantCreatesAllowed: true,
      shopifyPriceWritesAllowed: true,
      mongoWritesAllowed: false,
      cloudinaryWritesAllowed: false,
      mutatesPublications: false,
      checkoutCartBehaviorAdded: false,
    });
  });
});
