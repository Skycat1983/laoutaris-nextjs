const {
  DEFAULT_OUTPUT_PATH,
  buildFramedPrintCommerceAudit,
  calculateFrameCommerceGeometry,
  calculateVariantPrice,
  createVariantAuditRows,
  parseArgs,
  parseMoneyToCents,
  resolveFrameCommerceMeasurement,
} = require("../../../scripts/audit-framed-print-commerce-helpers.cjs");

const createPrintArtwork = ({
  artworkId = "661fc617648efb163cffacee",
  title = "No.002",
  handle = "joseph-laoutaris-print-no002-3cffacee",
  pixelWidth = 2297,
  pixelHeight = 3504,
  physicalPrintWidthCm,
  physicalPrintHeightCm,
} = {}) => ({
  artworkId,
  title,
  physicalPrintWidthCm,
  physicalPrintHeightCm,
  selectedArchiveImage: {
    secureUrl: "https://res.cloudinary.com/demo/no002.jpg",
    publicId: "artwork/no002",
    pixelWidth,
    pixelHeight,
  },
  products: [
    {
      productFamily: "print",
      proposedHandle: handle,
      title: `${title} - Fine Art Print`,
      productType: "Fine Art Print",
      physicalPrintWidthCm,
      physicalPrintHeightCm,
      selectedArchiveImage: {
        secureUrl: "https://res.cloudinary.com/demo/no002.jpg",
        publicId: "artwork/no002",
        pixelWidth,
        pixelHeight,
      },
    },
  ],
});

const testPolicy = {
  measurementPreference: "physical_print_dimensions_first",
  fallbackMeasurement: "image_pixels",
  approvalStatus: "draft_unapproved_owner_review_only",
  pricingNotice: "test placeholder rates",
  allowLooseMattedUnframed: false,
  handlingPrice: "2.00",
  rounding: { mode: "none" },
  frames: [
    {
      id: "unframed",
      label: "Unframed",
      basePrice: "0.00",
      ratePerUnit: "0",
    },
    {
      id: "black_wood",
      label: "Black wood",
      basePrice: "10.00",
      ratePerUnit: "0.50",
    },
  ],
  mats: [
    {
      id: "none",
      label: "No mat",
      marginRatio: 0,
      basePrice: "0.00",
      ratePerSquareUnit: "0",
    },
    {
      id: "white_small",
      label: "White mat",
      marginRatio: 0.1,
      basePrice: "5.00",
      ratePerSquareUnit: "0.25",
    },
    {
      id: "white_wide",
      label: "Wide white mat",
      marginRatio: 0.2,
      basePrice: "5.00",
      ratePerSquareUnit: "0.25",
    },
  ],
  matrix: [
    { frameId: "unframed", matId: "none" },
    { frameId: "black_wood", matId: "none" },
    { frameId: "black_wood", matId: "white_small" },
  ],
};

describe("audit framed print commerce helpers", () => {
  it("parses defaults and CLI overrides", () => {
    expect(
      parseArgs([
        "--input=reports/input.json",
        "--selection=reports/selection.json",
        "--output=reports/output.json",
        "--base-print-price=125.50",
        "--currency=EUR",
      ])
    ).toEqual({
      plan: "reports/input.json",
      selection: "reports/selection.json",
      output: "reports/output.json",
      basePrintPrice: "125.50",
      currencyCode: "EUR",
    });

    expect(parseArgs([]).output).toBe(DEFAULT_OUTPUT_PATH);
    expect(parseArgs(["--no-selection"]).selection).toBeNull();
  });

  it("uses physical dimensions before pixel fallback", () => {
    expect(
      resolveFrameCommerceMeasurement({
        pixelWidth: 2400,
        pixelHeight: 3600,
        physicalPrintWidthCm: 30,
        physicalPrintHeightCm: 45,
      })
    ).toMatchObject({
      measurement: {
        width: 30,
        height: 45,
        unit: "cm",
        source: "physical_print_dimensions",
      },
      sourcePixelDimensions: {
        pixelWidth: 2400,
        pixelHeight: 3600,
      },
      warnings: [],
    });
  });

  it("falls back to source pixels when physical dimensions are missing", () => {
    expect(
      resolveFrameCommerceMeasurement({
        pixelWidth: 2400,
        pixelHeight: 3600,
      })
    ).toMatchObject({
      measurement: {
        width: 2400,
        height: 3600,
        unit: "px",
        source: "pixel_ratio_fallback",
      },
      warnings: [],
    });
  });

  it.each([
    ["portrait", 2200, 3000],
    ["landscape", 3000, 2200],
    ["square", 2400, 2400],
    ["wide", 4000, 1600],
    ["tall", 1200, 2600],
    ["compact", 900, 1400],
    ["standard", 2200, 3000],
    ["large", 2500, 4000],
  ])("prices %s pixel examples without size-class thresholds", (
    _label,
    pixelWidth,
    pixelHeight
  ) => {
    const measurementResolution = resolveFrameCommerceMeasurement({
      pixelWidth,
      pixelHeight,
    });
    const rows = createVariantAuditRows({
      basePrintPrice: "100.00",
      measurementResolution,
      currencyCode: "GBP",
      pricingPolicy: testPolicy,
    });

    expect(measurementResolution.measurement).toMatchObject({
      width: pixelWidth,
      height: pixelHeight,
      unit: "px",
      source: "pixel_ratio_fallback",
    });
    expect(rows.every((row) => row.valid)).toBe(true);
    expect(rows.every((row) => row.pricingSizeClass === undefined)).toBe(true);
    expect(rows.every((row) => row.finalDraftPrice)).toBe(true);
  });

  it("reports invalid missing or zero dimensions and creates no valid prices", () => {
    const measurementResolution = resolveFrameCommerceMeasurement({
      pixelWidth: 0,
      pixelHeight: null,
    });
    const rows = createVariantAuditRows({
      basePrintPrice: "100.00",
      measurementResolution,
      currencyCode: "GBP",
      pricingPolicy: testPolicy,
    });

    expect(measurementResolution.measurement).toBeNull();
    expect(measurementResolution.warnings[0].code).toBe(
      "invalid_print_measurement"
    );
    expect(rows).toHaveLength(3);
    expect(rows.every((row) => row.valid === false)).toBe(true);
    expect(rows.every((row) => row.finalDraftPrice === null)).toBe(true);
  });

  it("keeps no-mat outer dimensions equal to the print dimensions", () => {
    expect(
      calculateFrameCommerceGeometry({
        measurement: { width: 100, height: 200, unit: "cm" },
        mat: { marginRatio: 0 },
      })
    ).toMatchObject({
      matMargin: 0,
      outerWidth: 100,
      outerHeight: 200,
      framePerimeter: 600,
      matArea: 0,
    });
  });

  it("expands mat variants by twice the mat margin", () => {
    const geometry = calculateFrameCommerceGeometry({
      measurement: { width: 100, height: 200, unit: "cm" },
      mat: { marginRatio: 0.1 },
    });

    expect(geometry).toMatchObject({
      matMargin: 10,
      outerWidth: 120,
      outerHeight: 220,
      framePerimeter: 680,
      matArea: 6400,
    });
  });

  it("increases frame perimeter and mat area for a larger mat ratio", () => {
    const small = calculateFrameCommerceGeometry({
      measurement: { width: 100, height: 200, unit: "cm" },
      mat: { marginRatio: 0.1 },
    });
    const wide = calculateFrameCommerceGeometry({
      measurement: { width: 100, height: 200, unit: "cm" },
      mat: { marginRatio: 0.2 },
    });

    expect(wide.framePerimeter).toBeGreaterThan(small.framePerimeter);
    expect(wide.matArea).toBeGreaterThan(small.matArea);
  });

  it("composes base print, frame, mat, handling, and rounding", () => {
    const priced = calculateVariantPrice({
      measurement: { width: 100, height: 200, unit: "cm" },
      frame: testPolicy.frames[1],
      mat: testPolicy.mats[1],
      basePrintPrice: "100.00",
      currencyCode: "GBP",
      handlingPrice: "2.00",
      rounding: { mode: "none" },
    });

    expect(priced).toMatchObject({
      framePrice: "350.00",
      matPrice: "1605.00",
      handlingPrice: "2.00",
      roundingAdjustment: "0.00",
      finalDraftPrice: "2057.00",
    });

    const rounded = calculateVariantPrice({
      measurement: { width: 100, height: 200, unit: "cm" },
      frame: testPolicy.frames[1],
      mat: testPolicy.mats[0],
      basePrintPrice: "100.00",
      currencyCode: "GBP",
      handlingPrice: "2.00",
      rounding: { mode: "nearest_10" },
    });

    expect(rounded).toMatchObject({
      finalDraftPrice: "410.00",
      roundingAdjustment: "-2.00",
    });
  });

  it("sets unframed frame price to zero", () => {
    const priced = calculateVariantPrice({
      measurement: { width: 100, height: 200, unit: "cm" },
      frame: testPolicy.frames[0],
      mat: testPolicy.mats[0],
      basePrintPrice: "100.00",
      currencyCode: "GBP",
      handlingPrice: "2.00",
      rounding: { mode: "none" },
    });

    expect(priced.framePrice).toBe("0.00");
    expect(priced.finalDraftPrice).toBe("102.00");
  });

  it("rejects unframed white mat rows unless explicitly approved", () => {
    const measurementResolution = resolveFrameCommerceMeasurement({
      pixelWidth: 100,
      pixelHeight: 200,
    });
    const rows = createVariantAuditRows({
      basePrintPrice: "100.00",
      measurementResolution,
      currencyCode: "GBP",
      pricingPolicy: {
        ...testPolicy,
        matrix: [{ frameId: "unframed", matId: "white_small" }],
      },
    });

    expect(rows[0]).toMatchObject({
      framePackage: "Unframed",
      mat: "White mat",
      valid: false,
      finalDraftPrice: null,
    });
    expect(rows[0].warnings[0].code).toBe("invalid_unframed_matted_variant");
  });

  it("builds a formula report without mutation flags and marks sale-sample prints", () => {
    const plan = {
      artworks: [
        createPrintArtwork(),
        createPrintArtwork({
          artworkId: "68f8a687e81cb7291cef624f",
          title: "No.121",
          handle: "joseph-laoutaris-print-no121-1cef624f",
          pixelWidth: 4000,
          pixelHeight: 1600,
        }),
        createPrintArtwork({
          artworkId: "missing-metrics",
          title: "No.999",
          handle: "joseph-laoutaris-print-no999-missing",
          pixelWidth: null,
          pixelHeight: 1600,
        }),
      ],
    };
    const selection = {
      selectedProducts: [
        {
          artworkId: "68f8a687e81cb7291cef624f",
          productFamily: "print",
          selectionGroup: "overlap",
          productId: "123",
          handle: "joseph-laoutaris-print-no121-1cef624f",
        },
      ],
    };

    const report = buildFramedPrintCommerceAudit({
      plan,
      selection,
      source: {},
      pricingPolicy: testPolicy,
      generatedAt: "2026-05-29T00:00:00.000Z",
    });

    expect(report).toMatchObject({
      mode: "framed_print_commerce_formula_audit",
      safety: {
        callsShopify: false,
        mutatesShopify: false,
        mutatesMongoDB: false,
        mutatesCloudinary: false,
        changesPrices: false,
        createsVariants: false,
        mutatesPublications: false,
        mutatesCheckoutOrCart: false,
        mutatesOrders: false,
        mutatesCustomers: false,
      },
      summary: {
        totalPrintProducts: 3,
        validMeasurementPrintProducts: 2,
        invalidMeasurementPrintProducts: 1,
        saleSamplePrintProducts: 1,
        proposedVariantRows: 9,
        validProposedVariantRows: 6,
      },
    });
    expect(report.pricingNotice).toContain("placeholder");
    expect(report.prints[1]).toMatchObject({
      saleSample: {
        selected: true,
        selectionGroup: "overlap",
      },
      measurement: {
        unit: "px",
        source: "pixel_ratio_fallback",
      },
    });
    expect(report.summary.framePerimeterDistribution).toMatchObject({
      min: expect.any(Number),
      median: expect.any(Number),
      max: expect.any(Number),
    });
    expect(report.summary.matAreaDistribution).toMatchObject({
      min: expect.any(Number),
      median: expect.any(Number),
      max: expect.any(Number),
    });
    expect(report.summary.finalDraftPriceByOption).toHaveLength(3);
    expect(report.prints[2].warnings[0].code).toBe(
      "invalid_print_measurement"
    );
  });

  it("rejects unsupported money values", () => {
    expect(() => parseMoneyToCents("100.123", "price")).toThrow(
      "non-negative money value"
    );
    expect(() => parseMoneyToCents("-1.00", "price")).toThrow(
      "non-negative money value"
    );
  });
});
