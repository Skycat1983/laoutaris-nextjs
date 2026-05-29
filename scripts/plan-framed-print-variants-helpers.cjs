const {
  createAdminGraphqlUrl,
  redactSensitiveText,
  validateRequiredEnv,
} = require("./reconcile-shopify-catalog-plan-helpers.cjs");

const DEFAULT_FORMULA_INPUT_PATH =
  "reports/framed-print-commerce-formula-audit.json";
const DEFAULT_SELECTION_INPUT_PATH = "reports/shopify-sale-sample-selection.json";
const DEFAULT_OUTPUT_PATH = "reports/framed-print-variant-plan.json";

const FRAME_PACKAGE_OPTION_NAME = "Frame package";
const MAT_OPTION_NAME = "Mat";
const DEFAULT_TITLE_OPTION_NAME = "Title";
const DEFAULT_TITLE_OPTION_VALUE = "Default Title";
const SHOPIFY_PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/(\d+)$/;
const SHOPIFY_VARIANT_GID_PATTERN = /^gid:\/\/shopify\/ProductVariant\/(\d+)$/;
const TOKEN_LIKE_PATTERN =
  /\b(?:shpat|shpca|shppa|shpss|shpua)_[A-Za-z0-9_-]+\b/g;

const APPROVED_TARGET_MATRIX = [
  {
    frameProfileId: "unframed",
    framePackage: "Unframed",
    matProfileId: "none",
    mat: "No mat",
  },
  {
    frameProfileId: "black_wood",
    framePackage: "Black wood",
    matProfileId: "none",
    mat: "No mat",
  },
  {
    frameProfileId: "black_wood",
    framePackage: "Black wood",
    matProfileId: "white_small",
    mat: "White mat",
  },
  {
    frameProfileId: "oak",
    framePackage: "Oak",
    matProfileId: "none",
    mat: "No mat",
  },
  {
    frameProfileId: "oak",
    framePackage: "Oak",
    matProfileId: "white_small",
    mat: "White mat",
  },
];

const APPROVED_FRAME_LABELS = new Set(
  APPROVED_TARGET_MATRIX.map((target) => target.framePackage)
);
const APPROVED_MAT_LABELS = new Set(
  APPROVED_TARGET_MATRIX.map((target) => target.mat)
);
const SUPPORTED_OPTION_NAMES = new Set([
  FRAME_PACKAGE_OPTION_NAME,
  MAT_OPTION_NAME,
  DEFAULT_TITLE_OPTION_NAME,
]);

const parseArgs = (argv) => {
  const options = {};

  argv.forEach((arg) => {
    if (arg.startsWith("--input=")) {
      options.input = arg.slice("--input=".length);
      return;
    }

    if (arg.startsWith("--formula=")) {
      options.input = arg.slice("--formula=".length);
      return;
    }

    if (arg.startsWith("--selection=")) {
      options.selection = arg.slice("--selection=".length);
      return;
    }

    if (arg.startsWith("--output=")) {
      options.output = arg.slice("--output=".length);
      return;
    }

    throw new Error(`Unsupported option: ${arg}`);
  });

  return {
    input: options.input ?? DEFAULT_FORMULA_INPUT_PATH,
    selection: options.selection ?? DEFAULT_SELECTION_INPUT_PATH,
    output: options.output ?? DEFAULT_OUTPUT_PATH,
  };
};

const createSafetySummary = () => ({
  readOnly: true,
  callsShopifyAdmin: true,
  shopifyMutationsAllowed: false,
  shopifyVariantCreatesAllowed: false,
  shopifyPriceWritesAllowed: false,
  shopifyPublicationWritesAllowed: false,
  mongoWritesAllowed: false,
  cloudinaryWritesAllowed: false,
  checkoutCartBehaviorAdded: false,
  tokensPersisted: false,
  mutatesShopify: false,
  mutatesMongoDB: false,
  mutatesCloudinary: false,
  changesPrices: false,
  createsVariants: false,
  mutatesPublications: false,
  mutatesCheckoutOrCart: false,
});

const createOwnerApprovalSnapshot = () => ({
  approvedAt: "2026-05-29",
  approvedFor: "read_only_variant_planning_only",
  framePackages: ["Unframed", "Black wood", "Oak"],
  heldBackFramePackages: ["White wood"],
  matProfiles: ["No mat", "White mat"],
  heldBackMatProfiles: ["Wide white mat"],
  invalidCombinations: [{ framePackage: "Unframed", mat: "White mat" }],
  rounding: "none",
  formulaRates: "placeholder_planning_rates_only",
  scope: "current_25_sale_sample_prints",
  stillBlocked: [
    "shopify_variant_creation_or_update",
    "shopify_price_writes",
    "shopify_product_status_or_publication_changes",
    "mongodb_or_cloudinary_mutation",
    "app_owned_checkout_or_cart_behavior",
    "launch_approval_for_pixel_derived_prices",
  ],
});

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const createWarning = (code, message, extra = {}) => ({
  code,
  message,
  ...extra,
});

const toShopifyProductGid = (product) => {
  const gid = normalizeString(product?.gid);

  if (SHOPIFY_PRODUCT_GID_PATTERN.test(gid)) {
    return gid;
  }

  const productId = normalizeString(product?.productId);

  if (/^\d+$/.test(productId)) {
    return `gid://shopify/Product/${productId}`;
  }

  return null;
};

const getLegacyIdFromGid = (gid, pattern) => {
  const match = typeof gid === "string" ? gid.match(pattern) : null;
  return match?.[1] ?? null;
};

const normalizeMoney = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numeric = Number(value);

  return Number.isFinite(numeric) ? numeric.toFixed(2) : String(value);
};

const optionPairKey = ({ framePackage, mat }) =>
  `${normalizeString(framePackage)}\u0000${normalizeString(mat)}`;

const targetKey = (target) =>
  optionPairKey({ framePackage: target.framePackage, mat: target.mat });

const getOptionValueMap = (selectedOptions = []) => {
  const map = new Map();

  selectedOptions.forEach((option) => {
    const name = normalizeString(option?.name);
    const value = normalizeString(option?.value);

    if (name) {
      map.set(name, value);
    }
  });

  return map;
};

const normalizeCurrentVariant = (variant) => {
  const selectedOptions = Array.isArray(variant?.selectedOptions)
    ? variant.selectedOptions
        .map((option) => ({
          name: normalizeString(option?.name),
          value: normalizeString(option?.value),
        }))
        .filter((option) => option.name)
    : [];
  const optionValues = getOptionValueMap(selectedOptions);
  let framePackage = optionValues.get(FRAME_PACKAGE_OPTION_NAME) ?? null;
  let mat = optionValues.get(MAT_OPTION_NAME) ?? null;

  if (
    !framePackage &&
    optionValues.get(DEFAULT_TITLE_OPTION_NAME) === DEFAULT_TITLE_OPTION_VALUE
  ) {
    framePackage = "Unframed";
  }

  if (!mat && framePackage === "Unframed") {
    mat = "No mat";
  }

  return {
    id: variant?.id ?? null,
    legacyResourceId:
      variant?.legacyResourceId ??
      getLegacyIdFromGid(variant?.id, SHOPIFY_VARIANT_GID_PATTERN),
    title: variant?.title ?? null,
    price: normalizeMoney(variant?.price),
    inventoryQuantity:
      typeof variant?.inventoryQuantity === "number"
        ? variant.inventoryQuantity
        : null,
    inventoryPolicy: variant?.inventoryPolicy ?? null,
    availableForSale:
      typeof variant?.availableForSale === "boolean"
        ? variant.availableForSale
        : null,
    selectedOptions,
    inferredFramePackage: framePackage,
    inferredMat: mat,
    inferredOptionKey:
      framePackage && mat ? optionPairKey({ framePackage, mat }) : null,
  };
};

const normalizeProductOption = (option) => ({
  id: option?.id ?? null,
  name: normalizeString(option?.name) || null,
  position:
    typeof option?.position === "number" || typeof option?.position === "string"
      ? option.position
      : null,
  values: Array.isArray(option?.values)
    ? option.values.filter((value) => typeof value === "string")
    : [],
});

const normalizeShopifyProductState = (product, { shopDomain } = {}) => {
  if (!product) {
    return null;
  }

  const legacyResourceId =
    product.legacyResourceId ??
    getLegacyIdFromGid(product.id, SHOPIFY_PRODUCT_GID_PATTERN);
  const summary = {
    id: product.id ?? null,
    legacyResourceId,
    handle: typeof product.handle === "string" ? product.handle : null,
    title: typeof product.title === "string" ? product.title : null,
    productType:
      typeof product.productType === "string" ? product.productType : null,
    status: typeof product.status === "string" ? product.status : null,
    publishedAt: product.publishedAt ?? null,
    tags: Array.isArray(product.tags)
      ? product.tags.filter((tag) => typeof tag === "string")
      : [],
    totalInventory:
      typeof product.totalInventory === "number" ? product.totalInventory : null,
    options: Array.isArray(product.options)
      ? product.options.map(normalizeProductOption)
      : [],
    variants: (product.variants?.nodes ?? product.variants ?? [])
      .filter(Boolean)
      .map(normalizeCurrentVariant),
  };

  if (legacyResourceId && shopDomain) {
    summary.adminUrl = `https://${shopDomain}/admin/products/${legacyResourceId}`;
  }

  return summary;
};

const validateInputs = ({ formulaAudit, selection }) => {
  if (
    !formulaAudit ||
    typeof formulaAudit !== "object" ||
    !Array.isArray(formulaAudit.prints)
  ) {
    throw new Error("Invalid formula audit input: expected a prints array.");
  }

  if (
    !selection ||
    typeof selection !== "object" ||
    !Array.isArray(selection.selectedProducts)
  ) {
    throw new Error(
      "Invalid sale-sample selection input: expected selectedProducts."
    );
  }
};

const createSelectedSaleSamplePrints = (selection) =>
  selection.selectedProducts
    .filter((product) => product?.productFamily === "print")
    .map((product) => ({
      artworkId: product.artworkId ?? null,
      artworkTitle: product.artworkTitle ?? null,
      artworkNumber: product.artworkNumber ?? null,
      productFamily: "print",
      selectionGroup: product.selectionGroup ?? null,
      gid: toShopifyProductGid(product),
      productId: product.productId ?? null,
      handle: product.handle ?? null,
      title: product.title ?? null,
      productType: product.productType ?? null,
      adminUrl: product.adminUrl ?? null,
    }));

const buildFormulaLookup = (formulaAudit) => {
  const lookup = {
    byArtworkId: new Map(),
    byHandle: new Map(),
  };

  formulaAudit.prints.forEach((print) => {
    if (print?.artworkId) {
      lookup.byArtworkId.set(print.artworkId, print);
    }

    if (print?.proposedPrintHandle) {
      lookup.byHandle.set(print.proposedPrintHandle, print);
    }
  });

  return lookup;
};

const findFormulaPrint = ({ selectedPrint, formulaLookup }) =>
  (selectedPrint.artworkId
    ? formulaLookup.byArtworkId.get(selectedPrint.artworkId)
    : null) ??
  (selectedPrint.handle ? formulaLookup.byHandle.get(selectedPrint.handle) : null) ??
  null;

const getApprovedTargetVariants = (formulaPrint) => {
  if (!formulaPrint) {
    return [];
  }

  const variantsByKey = new Map();
  (formulaPrint.proposedVariants ?? []).forEach((variant) => {
    if (!variant?.valid) {
      return;
    }

    variantsByKey.set(
      optionPairKey({
        framePackage: variant.framePackage,
        mat: variant.mat,
      }),
      variant
    );
  });

  return APPROVED_TARGET_MATRIX.map((approvedTarget) => {
    const formulaVariant = variantsByKey.get(targetKey(approvedTarget));

    if (!formulaVariant) {
      return null;
    }

    return {
      framePackage: formulaVariant.framePackage,
      frameProfileId: formulaVariant.frameProfileId,
      mat: formulaVariant.mat,
      matProfileId: formulaVariant.matProfileId,
      expectedPrice: formulaVariant.finalDraftPrice,
      currencyCode: formulaVariant.currencyCode,
      approvalStatus: formulaVariant.approvalStatus,
      measurement: formulaVariant.measurement ?? null,
      geometry: formulaVariant.geometry ?? null,
      pricing: {
        basePrintPrice: formulaVariant.basePrintPrice,
        framePrice: formulaVariant.framePrice,
        matPrice: formulaVariant.matPrice,
        handlingPrice: formulaVariant.handlingPrice,
        roundingAdjustment: formulaVariant.roundingAdjustment,
        finalDraftPrice: formulaVariant.finalDraftPrice,
      },
      formulaWarnings: formulaVariant.warnings ?? [],
    };
  }).filter(Boolean);
};

const analyzeCurrentProductState = (product) => {
  const warnings = [];
  const optionNames = new Set();

  (product?.options ?? []).forEach((option) => {
    if (option.name) {
      optionNames.add(option.name);
    }
  });

  (product?.variants ?? []).forEach((variant) => {
    variant.selectedOptions.forEach((option) => {
      if (option.name) {
        optionNames.add(option.name);
      }
    });
  });

  const unsupportedOptionNames = Array.from(optionNames).filter(
    (name) => !SUPPORTED_OPTION_NAMES.has(name)
  );

  if (unsupportedOptionNames.length > 0) {
    warnings.push(
      createWarning(
        "unsupported_option_names",
        "Current Shopify product has option names outside the approved frame/mat planning model.",
        { optionNames: unsupportedOptionNames }
      )
    );
  }

  const variantsByKey = new Map();
  const duplicateKeys = new Set();

  (product?.variants ?? []).forEach((variant) => {
    if (!variant.inferredOptionKey) {
      warnings.push(
        createWarning(
          "ambiguous_variant_options",
          "Current Shopify variant cannot be mapped to a frame package and mat combination.",
          { variantId: variant.id, selectedOptions: variant.selectedOptions }
        )
      );
      return;
    }

    if (!APPROVED_FRAME_LABELS.has(variant.inferredFramePackage)) {
      warnings.push(
        createWarning(
          "unexpected_existing_frame_value",
          "Current Shopify variant has a frame package value outside the approved matrix.",
          {
            variantId: variant.id,
            framePackage: variant.inferredFramePackage,
          }
        )
      );
    }

    if (!APPROVED_MAT_LABELS.has(variant.inferredMat)) {
      warnings.push(
        createWarning(
          "unexpected_existing_mat_value",
          "Current Shopify variant has a mat value outside the approved matrix.",
          { variantId: variant.id, mat: variant.inferredMat }
        )
      );
    }

    const matches = variantsByKey.get(variant.inferredOptionKey) ?? [];
    matches.push(variant);
    variantsByKey.set(variant.inferredOptionKey, matches);

    if (matches.length > 1) {
      duplicateKeys.add(variant.inferredOptionKey);
    }
  });

  if (duplicateKeys.size > 0) {
    warnings.push(
      createWarning(
        "duplicate_current_variant_combination",
        "Current Shopify product has duplicate variants for the same frame/mat combination.",
        {
          combinations: Array.from(duplicateKeys).map((key) => {
            const [framePackage, mat] = key.split("\u0000");
            return { framePackage, mat };
          }),
        }
      )
    );
  }

  if (product?.status && !["ACTIVE", "DRAFT"].includes(product.status)) {
    warnings.push(
      createWarning(
        "unavailable_product_state",
        "Current Shopify product status is not ACTIVE or DRAFT.",
        { status: product.status }
      )
    );
  }

  return {
    warnings,
    variantsByKey,
    duplicateKeys,
    hasBlockingOptionProblem:
      unsupportedOptionNames.length > 0 ||
      warnings.some((warning) =>
        [
          "ambiguous_variant_options",
          "unexpected_existing_frame_value",
          "unexpected_existing_mat_value",
        ].includes(warning.code)
      ),
  };
};

const createManualReviewTarget = ({ target, warnings }) => ({
  ...target,
  recommendedAction: "manual_review",
  matchedCurrentVariant: null,
  warnings,
});

const planTargetVariant = ({ target, productAnalysis }) => {
  const warnings = [];

  if (productAnalysis.hasBlockingOptionProblem) {
    return createManualReviewTarget({
      target,
      warnings: [
        createWarning(
          "manual_review_required",
          "Current Shopify options or variant values are not safe for automatic planning."
        ),
      ],
    });
  }

  const key = optionPairKey({
    framePackage: target.framePackage,
    mat: target.mat,
  });
  const matches = productAnalysis.variantsByKey.get(key) ?? [];

  if (productAnalysis.duplicateKeys.has(key) || matches.length > 1) {
    return createManualReviewTarget({
      target,
      warnings: [
        createWarning(
          "duplicate_current_variant_combination",
          "More than one current Shopify variant matches this target combination."
        ),
      ],
    });
  }

  if (matches.length === 0) {
    return {
      ...target,
      recommendedAction: "create_missing_variant",
      matchedCurrentVariant: null,
      warnings,
    };
  }

  const matchedCurrentVariant = matches[0];

  if (matchedCurrentVariant.price !== target.expectedPrice) {
    warnings.push(
      createWarning(
        "price_mismatch",
        "Current Shopify variant price differs from the formula report; no price write is performed.",
        {
          currentPrice: matchedCurrentVariant.price,
          expectedPrice: target.expectedPrice,
          currencyCode: target.currencyCode,
        }
      )
    );

    return {
      ...target,
      recommendedAction: "update_price_in_future_write",
      matchedCurrentVariant,
      warnings,
    };
  }

  return {
    ...target,
    recommendedAction: "preserve_existing_variant",
    matchedCurrentVariant,
    warnings,
  };
};

const buildProductPlanRow = ({
  selectedPrint,
  formulaPrint,
  productLookup,
  shopDomain,
}) => {
  const warnings = [];
  const targetVariants = getApprovedTargetVariants(formulaPrint);
  const lookupKey = selectedPrint.gid;
  const lookupResult = lookupKey
    ? productLookup.get(lookupKey) ?? { product: null, error: null }
    : { product: null, error: null };
  const currentProduct = normalizeShopifyProductState(lookupResult.product, {
    shopDomain,
  });

  if (!selectedPrint.gid) {
    warnings.push(
      createWarning(
        "missing_shopify_product_id",
        "Sale-sample print is missing a Shopify product GID or numeric product ID."
      )
    );
  }

  if (!formulaPrint) {
    warnings.push(
      createWarning(
        "missing_formula_row",
        "No matching formula audit print row was found for this sale-sample print."
      )
    );
  }

  if (formulaPrint && targetVariants.length !== APPROVED_TARGET_MATRIX.length) {
    warnings.push(
      createWarning(
        "missing_formula_target_rows",
        "Formula audit row does not contain every approved target matrix variant.",
        {
          expected: APPROVED_TARGET_MATRIX.length,
          actual: targetVariants.length,
        }
      )
    );
  }

  if (lookupResult.error) {
    warnings.push(
      createWarning(
        "shopify_product_read_failed",
        "Shopify Admin product read failed for this sale-sample print.",
        { error: lookupResult.error.message ?? String(lookupResult.error) }
      )
    );
  }

  if (selectedPrint.gid && !lookupResult.error && !currentProduct) {
    warnings.push(
      createWarning(
        "missing_shopify_product",
        "Shopify Admin product read returned no product for this sale-sample print."
      )
    );
  }

  if (
    currentProduct?.handle &&
    selectedPrint.handle &&
    currentProduct.handle !== selectedPrint.handle
  ) {
    warnings.push(
      createWarning(
        "shopify_handle_mismatch",
        "Current Shopify product handle differs from the sale-sample selection handle.",
        {
          selectionHandle: selectedPrint.handle,
          currentHandle: currentProduct.handle,
        }
      )
    );
  }

  let plannedTargetVariants = [];

  if (!currentProduct || warnings.some((warning) => warning.code === "missing_formula_row")) {
    plannedTargetVariants = targetVariants.map((target) =>
      createManualReviewTarget({
        target,
        warnings: [
          createWarning(
            "manual_review_required",
            "Target cannot be compared until the missing formula or Shopify product state is resolved."
          ),
        ],
      })
    );
  } else {
    const productAnalysis = analyzeCurrentProductState(currentProduct);
    warnings.push(...productAnalysis.warnings);
    plannedTargetVariants = targetVariants.map((target) =>
      planTargetVariant({ target, productAnalysis })
    );
  }

  return {
    artworkId: selectedPrint.artworkId,
    artworkTitle: selectedPrint.artworkTitle ?? formulaPrint?.title ?? null,
    artworkNumber:
      selectedPrint.artworkNumber ?? formulaPrint?.artworkNumber ?? null,
    productFamily: "print",
    selectionGroup: selectedPrint.selectionGroup,
    selectedProduct: selectedPrint,
    formulaPrint: formulaPrint
      ? {
          proposedPrintHandle: formulaPrint.proposedPrintHandle ?? null,
          productType: formulaPrint.productType ?? null,
          measurement: formulaPrint.measurement ?? null,
          sourcePixelDimensions: formulaPrint.sourcePixelDimensions ?? null,
          saleSample: formulaPrint.saleSample ?? null,
          warnings: formulaPrint.warnings ?? [],
        }
      : null,
    currentShopifyProduct: currentProduct,
    approvedTargetVariants: plannedTargetVariants,
    warnings,
  };
};

const summarizeRows = (rows) => {
  const summary = {
    selectedPrintProducts: rows.length,
    productsWithShopifyProductId: rows.filter((row) => row.selectedProduct.gid)
      .length,
    productsFetched: rows.filter((row) => row.currentShopifyProduct).length,
    productsWithWarnings: rows.filter((row) => row.warnings.length > 0).length,
    targetVariantRows: 0,
    preserveExistingVariant: 0,
    createMissingVariant: 0,
    updatePriceInFutureWrite: 0,
    manualReview: 0,
    priceMismatchWarnings: 0,
    duplicateVariantCombinationWarnings: 0,
    queryErrorCount: 0,
    missingFormulaRows: 0,
    missingShopifyProductIds: 0,
  };

  rows.forEach((row) => {
    if (row.warnings.some((warning) => warning.code === "shopify_product_read_failed")) {
      summary.queryErrorCount += 1;
    }

    if (row.warnings.some((warning) => warning.code === "missing_formula_row")) {
      summary.missingFormulaRows += 1;
    }

    if (
      row.warnings.some((warning) => warning.code === "missing_shopify_product_id")
    ) {
      summary.missingShopifyProductIds += 1;
    }

    if (
      row.warnings.some(
        (warning) => warning.code === "duplicate_current_variant_combination"
      )
    ) {
      summary.duplicateVariantCombinationWarnings += 1;
    }

    row.approvedTargetVariants.forEach((target) => {
      summary.targetVariantRows += 1;

      if (target.warnings.some((warning) => warning.code === "price_mismatch")) {
        summary.priceMismatchWarnings += 1;
      }

      switch (target.recommendedAction) {
        case "preserve_existing_variant":
          summary.preserveExistingVariant += 1;
          break;
        case "create_missing_variant":
          summary.createMissingVariant += 1;
          break;
        case "update_price_in_future_write":
          summary.updatePriceInFutureWrite += 1;
          break;
        case "manual_review":
          summary.manualReview += 1;
          break;
        default:
          break;
      }
    });
  });

  return summary;
};

const buildFramedPrintVariantPlan = ({
  formulaAudit,
  selection,
  productLookup = new Map(),
  source,
  shopDomain = null,
  generatedAt,
}) => {
  validateInputs({ formulaAudit, selection });
  const selectedPrints = createSelectedSaleSamplePrints(selection);
  const formulaLookup = buildFormulaLookup(formulaAudit);
  const rows = selectedPrints.map((selectedPrint) =>
    buildProductPlanRow({
      selectedPrint,
      formulaPrint: findFormulaPrint({ selectedPrint, formulaLookup }),
      productLookup,
      shopDomain,
    })
  );

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode: "read_only_framed_print_variant_plan",
    source,
    safety: createSafetySummary(),
    ownerApprovalSnapshot: createOwnerApprovalSnapshot(),
    approvedMatrix: APPROVED_TARGET_MATRIX,
    summary: summarizeRows(rows),
    products: rows,
    noMutationStatement:
      "This report is a read-only local plan. It reads Shopify Admin product state only and does not create variants, write prices, publish products, change product status, mutate MongoDB, mutate Cloudinary, or add checkout/cart behavior.",
  };
};

const hasReadFailures = (report) => report.summary.queryErrorCount > 0;

const redactPlanError = (error, sensitiveValues = []) =>
  redactSensitiveText(error, sensitiveValues).replace(
    TOKEN_LIKE_PATTERN,
    "[REDACTED]"
  );

module.exports = {
  APPROVED_TARGET_MATRIX,
  DEFAULT_FORMULA_INPUT_PATH,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_SELECTION_INPUT_PATH,
  FRAME_PACKAGE_OPTION_NAME,
  MAT_OPTION_NAME,
  buildFramedPrintVariantPlan,
  createAdminGraphqlUrl,
  createSafetySummary,
  hasReadFailures,
  normalizeShopifyProductState,
  parseArgs,
  redactPlanError,
  toShopifyProductGid,
  validateRequiredEnv,
};
