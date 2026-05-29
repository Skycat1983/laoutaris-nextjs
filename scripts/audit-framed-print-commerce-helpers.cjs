const DEFAULT_PLAN_INPUT_PATH = "reports/shopify-catalog-dry-run-plan.json";
const DEFAULT_SELECTION_INPUT_PATH = "reports/shopify-sale-sample-selection.json";
const DEFAULT_OUTPUT_PATH = "reports/framed-print-commerce-formula-audit.json";
const DEFAULT_BASE_PRINT_PRICE = "100.00";
const DEFAULT_CURRENCY_CODE = "GBP";

const DEFAULT_FRAME_PRICING_POLICY = {
  measurementPreference: "physical_print_dimensions_first",
  fallbackMeasurement: "image_pixels",
  approvalStatus: "draft_unapproved_owner_review_only",
  pricingNotice:
    "Pixel-derived prices are placeholder planning values for owner review only. Do not publish prices or variants until real dimensions and owner-approved framemaker rates exist.",
  allowLooseMattedUnframed: false,
  handlingPrice: "0.00",
  rounding: {
    mode: "none",
  },
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
      basePrice: "25.00",
      ratePerUnit: "0.0030",
    },
    {
      id: "oak",
      label: "Oak",
      basePrice: "35.00",
      ratePerUnit: "0.0038",
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
      marginRatio: 0.08,
      basePrice: "12.00",
      ratePerSquareUnit: "0.000003",
    },
  ],
  matrix: [
    { frameId: "unframed", matId: "none" },
    { frameId: "black_wood", matId: "none" },
    { frameId: "black_wood", matId: "white_small" },
    { frameId: "oak", matId: "none" },
    { frameId: "oak", matId: "white_small" },
  ],
};

const parseArgs = (argv) => {
  const options = {};

  argv.forEach((arg) => {
    if (arg.startsWith("--plan=")) {
      options.plan = arg.slice("--plan=".length);
      return;
    }

    if (arg.startsWith("--input=")) {
      options.plan = arg.slice("--input=".length);
      return;
    }

    if (arg.startsWith("--selection=")) {
      options.selection = arg.slice("--selection=".length);
      return;
    }

    if (arg === "--no-selection") {
      options.selection = null;
      return;
    }

    if (arg.startsWith("--output=")) {
      options.output = arg.slice("--output=".length);
      return;
    }

    if (arg.startsWith("--base-print-price=")) {
      options.basePrintPrice = arg.slice("--base-print-price=".length);
      return;
    }

    if (arg.startsWith("--currency=")) {
      options.currencyCode = arg.slice("--currency=".length);
      return;
    }

    throw new Error(`Unsupported option: ${arg}`);
  });

  return {
    plan: options.plan ?? DEFAULT_PLAN_INPUT_PATH,
    selection:
      options.selection === undefined
        ? DEFAULT_SELECTION_INPUT_PATH
        : options.selection,
    output: options.output ?? DEFAULT_OUTPUT_PATH,
    basePrintPrice: options.basePrintPrice ?? DEFAULT_BASE_PRINT_PRICE,
    currencyCode: options.currencyCode ?? DEFAULT_CURRENCY_CODE,
  };
};

const isPositiveNumber = (value) =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const roundMetric = (value) => Number(value.toFixed(4));

const parseMoneyToCents = (value, optionName = "money") => {
  const raw = String(value ?? "").trim();

  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) {
    throw new Error(`${optionName} must be a non-negative money value.`);
  }

  const [major, minor = ""] = raw.split(".");
  return (
    Number.parseInt(major, 10) * 100 +
    Number.parseInt(minor.padEnd(2, "0"), 10)
  );
};

const parseNonNegativeDecimal = (value, optionName = "decimal") => {
  const raw = String(value ?? "").trim();

  if (!/^\d+(?:\.\d+)?$/.test(raw)) {
    throw new Error(`${optionName} must be a non-negative decimal value.`);
  }

  return Number(raw);
};

const formatCents = (cents) => {
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(cents);
  const major = Math.floor(absolute / 100);
  const minor = String(absolute % 100).padStart(2, "0");

  return `${sign}${major}.${minor}`;
};

const moneyToNumber = (value, optionName) =>
  parseMoneyToCents(value, optionName) / 100;

const formatMoneyNumber = (value) => formatCents(Math.round(value * 100));

const applyRounding = (amount, rounding = { mode: "none" }) => {
  switch (rounding.mode) {
    case "none":
      return amount;
    case "nearest_5":
      return Math.round(amount / 5) * 5;
    case "nearest_10":
      return Math.round(amount / 10) * 10;
    case "psychological_ending": {
      const roundedUp = Math.ceil(amount);
      return Math.max(0, roundedUp - 0.01);
    }
    default:
      throw new Error(`Unsupported rounding mode: ${rounding.mode}`);
  }
};

const createProfileMap = (profiles, profileType) => {
  const map = new Map();

  profiles.forEach((profile) => {
    if (!profile?.id) {
      throw new Error(`${profileType} profile is missing an id.`);
    }

    map.set(profile.id, profile);
  });

  return map;
};

const resolveFrameCommerceMeasurement = (metrics = {}) => {
  const physicalWidth = metrics.physicalPrintWidthCm;
  const physicalHeight = metrics.physicalPrintHeightCm;

  if (isPositiveNumber(physicalWidth) && isPositiveNumber(physicalHeight)) {
    return {
      measurement: {
        width: physicalWidth,
        height: physicalHeight,
        unit: "cm",
        source: "physical_print_dimensions",
      },
      sourcePixelDimensions: {
        pixelWidth: isPositiveNumber(metrics.pixelWidth)
          ? metrics.pixelWidth
          : null,
        pixelHeight: isPositiveNumber(metrics.pixelHeight)
          ? metrics.pixelHeight
          : null,
      },
      warnings: [],
    };
  }

  const pixelWidth = metrics.pixelWidth;
  const pixelHeight = metrics.pixelHeight;

  if (isPositiveNumber(pixelWidth) && isPositiveNumber(pixelHeight)) {
    return {
      measurement: {
        width: pixelWidth,
        height: pixelHeight,
        unit: "px",
        source: "pixel_ratio_fallback",
      },
      sourcePixelDimensions: {
        pixelWidth,
        pixelHeight,
      },
      warnings: [],
    };
  }

  return {
    measurement: null,
    sourcePixelDimensions: {
      pixelWidth: isPositiveNumber(pixelWidth) ? pixelWidth : null,
      pixelHeight: isPositiveNumber(pixelHeight) ? pixelHeight : null,
    },
    warnings: [
      {
        code: "invalid_print_measurement",
        message:
          "Framed print pricing requires complete positive physical dimensions or positive source pixel dimensions.",
      },
    ],
  };
};

const calculateFrameCommerceGeometry = ({ measurement, mat }) => {
  const printWidth = measurement.width;
  const printHeight = measurement.height;
  const shortSide = Math.min(printWidth, printHeight);
  const matMargin = shortSide * mat.marginRatio;
  const outerWidth = printWidth + matMargin * 2;
  const outerHeight = printHeight + matMargin * 2;
  const framePerimeter = outerWidth * 2 + outerHeight * 2;
  const printArea = printWidth * printHeight;
  const outerArea = outerWidth * outerHeight;
  const matArea = outerArea - printArea;

  return {
    printWidth: roundMetric(printWidth),
    printHeight: roundMetric(printHeight),
    shortSide: roundMetric(shortSide),
    matMargin: roundMetric(matMargin),
    outerWidth: roundMetric(outerWidth),
    outerHeight: roundMetric(outerHeight),
    framePerimeter: roundMetric(framePerimeter),
    printArea: roundMetric(printArea),
    outerArea: roundMetric(outerArea),
    matArea: roundMetric(matArea),
  };
};

const createInvalidVariantRow = ({
  frame,
  mat,
  basePrintPrice,
  currencyCode,
  warnings,
}) => ({
  framePackage: frame.label,
  frameProfileId: frame.id,
  mat: mat.label,
  matProfileId: mat.id,
  valid: false,
  warnings,
  basePrintPrice,
  framePrice: null,
  matPrice: null,
  handlingPrice: null,
  roundingAdjustment: null,
  finalDraftPrice: null,
  currencyCode,
  approvalStatus: DEFAULT_FRAME_PRICING_POLICY.approvalStatus,
});

const calculateVariantPrice = ({
  measurement,
  frame,
  mat,
  basePrintPrice,
  currencyCode,
  handlingPrice,
  rounding,
}) => {
  const geometry = calculateFrameCommerceGeometry({ measurement, mat });
  const basePrintAmount = moneyToNumber(basePrintPrice, "--base-print-price");
  const frameBase = moneyToNumber(
    frame.basePrice,
    `frame.${frame.id}.basePrice`
  );
  const frameRate = parseNonNegativeDecimal(
    frame.ratePerUnit,
    `frame.${frame.id}.ratePerUnit`
  );
  const matBase = moneyToNumber(mat.basePrice, `mat.${mat.id}.basePrice`);
  const matRate = parseNonNegativeDecimal(
    mat.ratePerSquareUnit,
    `mat.${mat.id}.ratePerSquareUnit`
  );
  const handlingAmount = moneyToNumber(handlingPrice, "handlingPrice");
  const framePrice =
    frame.id === "unframed"
      ? 0
      : frameBase + geometry.framePerimeter * frameRate;
  const matPrice =
    mat.id === "none" ? 0 : matBase + geometry.matArea * matRate;
  const unroundedPrice =
    basePrintAmount + framePrice + matPrice + handlingAmount;
  const roundedPrice = applyRounding(unroundedPrice, rounding);
  const roundingAdjustment = roundedPrice - unroundedPrice;

  return {
    geometry,
    basePrintPrice,
    framePrice: formatMoneyNumber(framePrice),
    matPrice: formatMoneyNumber(matPrice),
    handlingPrice: formatMoneyNumber(handlingAmount),
    roundingAdjustment: formatMoneyNumber(roundingAdjustment),
    finalDraftPrice: formatMoneyNumber(roundedPrice),
    currencyCode,
  };
};

const createVariantAuditRows = ({
  basePrintPrice,
  measurementResolution,
  currencyCode,
  pricingPolicy = DEFAULT_FRAME_PRICING_POLICY,
}) => {
  const framesById = createProfileMap(pricingPolicy.frames, "frame");
  const matsById = createProfileMap(pricingPolicy.mats, "mat");
  const baseWarnings = measurementResolution.warnings ?? [];

  return pricingPolicy.matrix.map((variant) => {
    const frame = framesById.get(variant.frameId);
    const mat = matsById.get(variant.matId);

    if (!frame) {
      throw new Error(
        `Unknown frame profile in pricing matrix: ${variant.frameId}`
      );
    }

    if (!mat) {
      throw new Error(`Unknown mat profile in pricing matrix: ${variant.matId}`);
    }

    const warnings = [...baseWarnings];

    if (
      frame.id === "unframed" &&
      mat.id !== "none" &&
      pricingPolicy.allowLooseMattedUnframed !== true
    ) {
      warnings.push({
        code: "invalid_unframed_matted_variant",
        message:
          "Unframed matted prints are not part of the sellable matrix unless explicitly approved.",
      });
    }

    if (!measurementResolution.measurement || warnings.length > 0) {
      return createInvalidVariantRow({
        frame,
        mat,
        basePrintPrice,
        currencyCode,
        warnings,
      });
    }

    const pricedVariant = calculateVariantPrice({
      measurement: measurementResolution.measurement,
      frame,
      mat,
      basePrintPrice,
      currencyCode,
      handlingPrice: pricingPolicy.handlingPrice,
      rounding: pricingPolicy.rounding,
    });

    return {
      framePackage: frame.label,
      frameProfileId: frame.id,
      mat: mat.label,
      matProfileId: mat.id,
      valid: true,
      measurement: measurementResolution.measurement,
      ...pricedVariant,
      warnings,
      approvalStatus: pricingPolicy.approvalStatus,
    };
  });
};

const extractArtworkNumber = (title) => {
  const match = String(title ?? "").match(/\bNo\.?\s*(\d+)\b/i);

  return match ? match[1].padStart(3, "0") : null;
};

const createSelectedPrintMap = (selection) => {
  const selectedPrints = new Map();

  if (!selection || !Array.isArray(selection.selectedProducts)) {
    return selectedPrints;
  }

  selection.selectedProducts.forEach((product) => {
    if (product?.productFamily !== "print") {
      return;
    }

    const entry = {
      selectionGroup: product.selectionGroup ?? null,
      productId: product.productId ?? null,
      handle: product.handle ?? null,
      title: product.title ?? null,
    };

    if (product.artworkId) {
      selectedPrints.set(`artworkId:${product.artworkId}`, entry);
    }

    if (product.handle) {
      selectedPrints.set(`handle:${product.handle}`, entry);
    }
  });

  return selectedPrints;
};

const findSelectedPrint = ({ artwork, product, selectedPrints }) => {
  return (
    selectedPrints.get(`artworkId:${artwork.artworkId}`) ??
    selectedPrints.get(`handle:${product.proposedHandle}`) ??
    null
  );
};

const summarizeNumbers = (values) => {
  const sorted = values
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => left - right);

  if (sorted.length === 0) {
    return null;
  }

  const percentile = (ratio) => {
    const index = Math.min(
      sorted.length - 1,
      Math.max(0, Math.round((sorted.length - 1) * ratio))
    );

    return sorted[index];
  };

  const total = sorted.reduce((sum, value) => sum + value, 0);

  return {
    min: sorted[0],
    p25: percentile(0.25),
    median: percentile(0.5),
    p75: percentile(0.75),
    max: sorted[sorted.length - 1],
    average: roundMetric(total / sorted.length),
  };
};

const summarizePricesByOption = (prints) => {
  const pricesByOption = new Map();

  prints.forEach((print) => {
    print.proposedVariants.forEach((variant) => {
      if (!variant.valid || !variant.finalDraftPrice) {
        return;
      }

      const key = `${variant.framePackage} / ${variant.mat}`;
      const existing = pricesByOption.get(key) ?? {
        framePackage: variant.framePackage,
        frameProfileId: variant.frameProfileId,
        mat: variant.mat,
        matProfileId: variant.matProfileId,
        currencyCode: variant.currencyCode,
        values: [],
      };

      existing.values.push(Number(variant.finalDraftPrice));
      pricesByOption.set(key, existing);
    });
  });

  return Array.from(pricesByOption.values()).map((entry) => {
    const summary = summarizeNumbers(entry.values);

    return {
      framePackage: entry.framePackage,
      frameProfileId: entry.frameProfileId,
      mat: entry.mat,
      matProfileId: entry.matProfileId,
      currencyCode: entry.currencyCode,
      min: formatMoneyNumber(summary.min),
      median: formatMoneyNumber(summary.median),
      max: formatMoneyNumber(summary.max),
    };
  });
};

const summarizePrintAudits = (prints) => {
  const framePerimeters = [];
  const matAreas = [];

  prints.forEach((print) => {
    print.proposedVariants.forEach((variant) => {
      if (!variant.valid || !variant.geometry) {
        return;
      }

      framePerimeters.push(variant.geometry.framePerimeter);
      matAreas.push(variant.geometry.matArea);
    });
  });

  return {
    totalPrintProducts: prints.length,
    validMeasurementPrintProducts: prints.filter((print) => print.measurement)
      .length,
    invalidMeasurementPrintProducts: prints.filter((print) => !print.measurement)
      .length,
    saleSamplePrintProducts: prints.filter((print) => print.saleSample.selected)
      .length,
    proposedVariantRows: prints.reduce(
      (count, print) => count + print.proposedVariants.length,
      0
    ),
    validProposedVariantRows: prints.reduce(
      (count, print) =>
        count +
        print.proposedVariants.filter((variant) => variant.valid).length,
      0
    ),
    framePerimeterDistribution: summarizeNumbers(framePerimeters),
    matAreaDistribution: summarizeNumbers(matAreas),
    finalDraftPriceByOption: summarizePricesByOption(prints),
  };
};

const buildFramedPrintCommerceAudit = ({
  plan,
  selection = null,
  source,
  basePrintPrice = DEFAULT_BASE_PRINT_PRICE,
  currencyCode = DEFAULT_CURRENCY_CODE,
  pricingPolicy = DEFAULT_FRAME_PRICING_POLICY,
  generatedAt,
}) => {
  parseMoneyToCents(basePrintPrice, "--base-print-price");
  const selectedPrints = createSelectedPrintMap(selection);
  const prints = [];

  (plan.artworks ?? []).forEach((artwork) => {
    const printProduct = (artwork.products ?? []).find(
      (product) => product?.productFamily === "print"
    );

    if (!printProduct) {
      return;
    }

    const imageMetrics =
      printProduct.selectedArchiveImage ?? artwork.selectedArchiveImage ?? {};
    const measurementResolution = resolveFrameCommerceMeasurement({
      pixelWidth: imageMetrics.pixelWidth,
      pixelHeight: imageMetrics.pixelHeight,
      physicalPrintWidthCm:
        printProduct.physicalPrintWidthCm ?? artwork.physicalPrintWidthCm,
      physicalPrintHeightCm:
        printProduct.physicalPrintHeightCm ?? artwork.physicalPrintHeightCm,
    });
    const selectedPrint = findSelectedPrint({
      artwork,
      product: printProduct,
      selectedPrints,
    });

    prints.push({
      artworkId: artwork.artworkId ?? null,
      title: artwork.title ?? null,
      artworkNumber: extractArtworkNumber(artwork.title),
      proposedPrintHandle: printProduct.proposedHandle ?? null,
      productType: printProduct.productType ?? null,
      image: {
        secureUrl: imageMetrics.secureUrl ?? null,
        publicId: imageMetrics.publicId ?? null,
        pixelWidth: imageMetrics.pixelWidth ?? null,
        pixelHeight: imageMetrics.pixelHeight ?? null,
      },
      measurement: measurementResolution.measurement,
      sourcePixelDimensions: measurementResolution.sourcePixelDimensions,
      saleSample: {
        selected: Boolean(selectedPrint),
        selectionGroup: selectedPrint?.selectionGroup ?? null,
        productId: selectedPrint?.productId ?? null,
        handle: selectedPrint?.handle ?? null,
      },
      proposedVariants: createVariantAuditRows({
        basePrintPrice,
        measurementResolution,
        currencyCode,
        pricingPolicy,
      }),
      warnings: measurementResolution.warnings,
    });
  });

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode: "framed_print_commerce_formula_audit",
    source,
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
    approvalStatus: pricingPolicy.approvalStatus,
    pricingNotice: pricingPolicy.pricingNotice,
    options: {
      basePrintPrice,
      currencyCode,
      measurementPreference: pricingPolicy.measurementPreference,
      fallbackMeasurement: pricingPolicy.fallbackMeasurement,
      pricingSourceFallback: "pixel_ratio_fallback",
      physicalDimensionsSupported: true,
      frames: pricingPolicy.frames,
      mats: pricingPolicy.mats,
      variantMatrix: pricingPolicy.matrix,
      handlingPrice: pricingPolicy.handlingPrice,
      rounding: pricingPolicy.rounding,
      allowLooseMattedUnframed: pricingPolicy.allowLooseMattedUnframed,
    },
    summary: summarizePrintAudits(prints),
    prints,
    noMutationStatement:
      "This report is local planning evidence only. It does not call or mutate Shopify, MongoDB, Cloudinary, checkout/cart, publications, orders, customers, variants, or prices.",
  };
};

module.exports = {
  DEFAULT_BASE_PRINT_PRICE,
  DEFAULT_CURRENCY_CODE,
  DEFAULT_FRAME_PRICING_POLICY,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_PLAN_INPUT_PATH,
  DEFAULT_SELECTION_INPUT_PATH,
  applyRounding,
  buildFramedPrintCommerceAudit,
  calculateFrameCommerceGeometry,
  calculateVariantPrice,
  createVariantAuditRows,
  formatCents,
  parseArgs,
  parseMoneyToCents,
  resolveFrameCommerceMeasurement,
};
