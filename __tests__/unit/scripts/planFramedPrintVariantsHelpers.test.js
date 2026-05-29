const {
  APPROVED_TARGET_MATRIX,
  DEFAULT_OUTPUT_PATH,
  buildFramedPrintVariantPlan,
  createSafetySummary,
  parseArgs,
} = require("../../../scripts/plan-framed-print-variants-helpers.cjs");

const createTargetVariant = ({
  framePackage,
  frameProfileId,
  mat,
  matProfileId,
  price,
}) => ({
  framePackage,
  frameProfileId,
  mat,
  matProfileId,
  valid: true,
  finalDraftPrice: price,
  currencyCode: "GBP",
  approvalStatus: "draft_unapproved_owner_review_only",
  measurement: {
    width: 1000,
    height: 1500,
    unit: "px",
    source: "pixel_ratio_fallback",
  },
  geometry: {
    framePerimeter: 5000,
    matArea: mat === "No mat" ? 0 : 100000,
  },
  basePrintPrice: "100.00",
  framePrice: price === "100.00" ? "0.00" : "25.00",
  matPrice: mat === "No mat" ? "0.00" : "12.00",
  handlingPrice: "0.00",
  roundingAdjustment: "0.00",
  warnings: [],
});

const approvedFormulaVariants = [
  createTargetVariant({
    framePackage: "Unframed",
    frameProfileId: "unframed",
    mat: "No mat",
    matProfileId: "none",
    price: "100.00",
  }),
  createTargetVariant({
    framePackage: "Black wood",
    frameProfileId: "black_wood",
    mat: "No mat",
    matProfileId: "none",
    price: "145.00",
  }),
  createTargetVariant({
    framePackage: "Black wood",
    frameProfileId: "black_wood",
    mat: "White mat",
    matProfileId: "white_small",
    price: "160.00",
  }),
  createTargetVariant({
    framePackage: "Oak",
    frameProfileId: "oak",
    mat: "No mat",
    matProfileId: "none",
    price: "155.00",
  }),
  createTargetVariant({
    framePackage: "Oak",
    frameProfileId: "oak",
    mat: "White mat",
    matProfileId: "white_small",
    price: "175.00",
  }),
  createTargetVariant({
    framePackage: "White wood",
    frameProfileId: "white_wood",
    mat: "No mat",
    matProfileId: "none",
    price: "150.00",
  }),
];

const createFormulaPrint = ({
  artworkId = "artwork-1",
  handle = "joseph-laoutaris-print-no001",
  variants = approvedFormulaVariants,
} = {}) => ({
  artworkId,
  title: "No.001",
  artworkNumber: "001",
  proposedPrintHandle: handle,
  productType: "Fine Art Print",
  measurement: {
    width: 1000,
    height: 1500,
    unit: "px",
    source: "pixel_ratio_fallback",
  },
  sourcePixelDimensions: {
    pixelWidth: 1000,
    pixelHeight: 1500,
  },
  saleSample: {
    selected: true,
    selectionGroup: "print_only",
    productId: "111",
    handle,
  },
  proposedVariants: variants,
  warnings: [],
});

const createFormulaAudit = (prints = [createFormulaPrint()]) => ({
  mode: "framed_print_commerce_formula_audit",
  safety: {
    mutatesShopify: false,
    changesPrices: false,
    createsVariants: false,
  },
  prints,
});

const createSelection = (products = []) => ({
  selectedProducts: products.length
    ? products
    : [
        {
          artworkId: "artwork-1",
          artworkTitle: "No.001",
          artworkNumber: "001",
          productFamily: "print",
          selectionGroup: "print_only",
          gid: "gid://shopify/Product/111",
          productId: "111",
          handle: "joseph-laoutaris-print-no001",
          title: "No.001 - Fine Art Print",
          productType: "Fine Art Print",
        },
      ],
});

const createVariant = ({
  id = "gid://shopify/ProductVariant/9001",
  price = "100.00",
  framePackage = "Unframed",
  mat,
  optionName = "Frame package",
  duplicateIndex = "",
} = {}) => ({
  id: duplicateIndex ? `${id}${duplicateIndex}` : id,
  legacyResourceId: duplicateIndex ? `9001${duplicateIndex}` : "9001",
  title: framePackage,
  price,
  inventoryQuantity: 50,
  inventoryPolicy: "DENY",
  selectedOptions: [
    {
      name: optionName,
      value: framePackage,
    },
    ...(mat ? [{ name: "Mat", value: mat }] : []),
  ],
});

const createCurrentProduct = ({ options, variants } = {}) => ({
  id: "gid://shopify/Product/111",
  legacyResourceId: "111",
  handle: "joseph-laoutaris-print-no001",
  title: "No.001 - Fine Art Print",
  productType: "Fine Art Print",
  status: "ACTIVE",
  publishedAt: "2026-05-29T00:00:00Z",
  totalInventory: 50,
  options:
    options ??
    [
      {
        id: "gid://shopify/ProductOption/1",
        name: "Frame package",
        position: 1,
        values: ["Unframed"],
      },
    ],
  variants: {
    nodes: variants ?? [createVariant()],
  },
});

const buildReport = ({
  formulaAudit = createFormulaAudit(),
  selection = createSelection(),
  currentProduct = createCurrentProduct(),
  productLookup,
} = {}) =>
  buildFramedPrintVariantPlan({
    formulaAudit,
    selection,
    productLookup:
      productLookup ??
      new Map([
        [
          "gid://shopify/Product/111",
          {
            product: currentProduct,
            error: null,
          },
        ],
      ]),
    shopDomain: "laoutaris.myshopify.com",
    source: {},
    generatedAt: "2026-05-29T00:00:00.000Z",
  });

const getTarget = (report, framePackage, mat) =>
  report.products[0].approvedTargetVariants.find(
    (target) => target.framePackage === framePackage && target.mat === mat
  );

describe("plan framed print variant helpers", () => {
  it("parses defaults and CLI overrides", () => {
    expect(parseArgs([]).output).toBe(DEFAULT_OUTPUT_PATH);
    expect(
      parseArgs([
        "--input=reports/formula.json",
        "--selection=reports/selection.json",
        "--output=reports/plan.json",
      ])
    ).toEqual({
      input: "reports/formula.json",
      selection: "reports/selection.json",
      output: "reports/plan.json",
    });
  });

  it("limits planning scope to sale-sample print products", () => {
    const report = buildReport({
      formulaAudit: createFormulaAudit([
        createFormulaPrint(),
        createFormulaPrint({
          artworkId: "artwork-2",
          handle: "joseph-laoutaris-print-no002",
        }),
      ]),
      selection: createSelection([
        {
          artworkId: "artwork-1",
          productFamily: "print",
          gid: "gid://shopify/Product/111",
          productId: "111",
          handle: "joseph-laoutaris-print-no001",
        },
        {
          artworkId: "artwork-original",
          productFamily: "original",
          gid: "gid://shopify/Product/222",
          productId: "222",
          handle: "joseph-laoutaris-original-no001",
        },
      ]),
    });

    expect(report.summary.selectedPrintProducts).toBe(1);
    expect(report.products).toHaveLength(1);
    expect(report.products[0].selectedProduct.productFamily).toBe("print");
  });

  it("uses only approved formula target rows for the matrix", () => {
    const report = buildReport();

    expect(report.approvedMatrix).toEqual(APPROVED_TARGET_MATRIX);
    expect(report.products[0].approvedTargetVariants).toHaveLength(5);
    expect(
      report.products[0].approvedTargetVariants.map(
        (target) => `${target.framePackage} / ${target.mat}`
      )
    ).toEqual([
      "Unframed / No mat",
      "Black wood / No mat",
      "Black wood / White mat",
      "Oak / No mat",
      "Oak / White mat",
    ]);
  });

  it("preserves an existing Unframed / No mat variant and creates missing framed variants", () => {
    const report = buildReport();

    expect(getTarget(report, "Unframed", "No mat")).toMatchObject({
      recommendedAction: "preserve_existing_variant",
      matchedCurrentVariant: {
        price: "100.00",
        inferredFramePackage: "Unframed",
        inferredMat: "No mat",
      },
    });
    expect(getTarget(report, "Black wood", "No mat")).toMatchObject({
      recommendedAction: "create_missing_variant",
      matchedCurrentVariant: null,
    });
    expect(report.summary.createMissingVariant).toBe(4);
  });

  it("reports price mismatches without writing prices", () => {
    const report = buildReport({
      currentProduct: createCurrentProduct({
        variants: [createVariant({ price: "95.00" })],
      }),
    });
    const target = getTarget(report, "Unframed", "No mat");

    expect(target.recommendedAction).toBe("update_price_in_future_write");
    expect(target.warnings[0]).toMatchObject({
      code: "price_mismatch",
      currentPrice: "95.00",
      expectedPrice: "100.00",
    });
    expect(report.safety.shopifyPriceWritesAllowed).toBe(false);
  });

  it("forces manual review for unexpected Shopify option names", () => {
    const report = buildReport({
      currentProduct: createCurrentProduct({
        options: [{ name: "Size", position: 1, values: ["Small"] }],
        variants: [createVariant({ framePackage: "Small", optionName: "Size" })],
      }),
    });

    expect(report.products[0].warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unsupported_option_names" }),
      ])
    );
    expect(getTarget(report, "Unframed", "No mat").recommendedAction).toBe(
      "manual_review"
    );
  });

  it("forces manual review for duplicate current variant combinations", () => {
    const report = buildReport({
      currentProduct: createCurrentProduct({
        variants: [
          createVariant({ duplicateIndex: "a" }),
          createVariant({ duplicateIndex: "b" }),
        ],
      }),
    });

    expect(report.products[0].warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate_current_variant_combination" }),
      ])
    );
    expect(getTarget(report, "Unframed", "No mat").recommendedAction).toBe(
      "manual_review"
    );
  });

  it("warns for missing Shopify product IDs and missing formula rows", () => {
    const report = buildReport({
      formulaAudit: createFormulaAudit([]),
      selection: createSelection([
        {
          artworkId: "missing-formula",
          productFamily: "print",
          handle: "joseph-laoutaris-print-missing",
        },
      ]),
      productLookup: new Map(),
    });

    expect(report.summary.missingShopifyProductIds).toBe(1);
    expect(report.summary.missingFormulaRows).toBe(1);
    expect(report.products[0].warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "missing_shopify_product_id" }),
        expect.objectContaining({ code: "missing_formula_row" }),
      ])
    );
  });

  it("keeps report safety flags read-only and mutation-negative", () => {
    const safety = createSafetySummary();
    const report = buildReport();

    expect(safety).toMatchObject({
      readOnly: true,
      shopifyMutationsAllowed: false,
      shopifyVariantCreatesAllowed: false,
      shopifyPriceWritesAllowed: false,
      mongoWritesAllowed: false,
      cloudinaryWritesAllowed: false,
      checkoutCartBehaviorAdded: false,
      tokensPersisted: false,
    });
    expect(report.noMutationStatement).toContain("does not create variants");
    expect(report.safety.createsVariants).toBe(false);
  });
});
