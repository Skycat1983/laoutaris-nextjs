const {
  createAdminGraphqlUrl,
  redactSensitiveText,
  validateRequiredEnv,
} = require("./reconcile-shopify-catalog-plan-helpers.cjs");

const DEFAULT_PLAN_INPUT_PATH = "reports/framed-print-variant-plan.json";
const DEFAULT_OUTPUT_PATH = "reports/framed-print-variant-write-report.json";
const APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION =
  "CREATE_FRAMED_PRINT_VARIANTS";
const FRAME_PACKAGE_OPTION_NAME = "Frame package";
const MAT_OPTION_NAME = "Mat";
const TOKEN_LIKE_PATTERN =
  /\b(?:shpat|shpca|shppa|shpss|shpua)_[A-Za-z0-9_-]+\b/g;

const parseArgs = (argv) => {
  const options = {
    mode: "plan",
  };

  argv.forEach((arg) => {
    if (arg.startsWith("--input=")) {
      options.input = arg.slice("--input=".length);
      return;
    }

    if (arg.startsWith("--plan=")) {
      options.input = arg.slice("--plan=".length);
      return;
    }

    if (arg.startsWith("--output=")) {
      options.output = arg.slice("--output=".length);
      return;
    }

    if (arg.startsWith("--mode=")) {
      options.mode = arg.slice("--mode=".length);
      return;
    }

    if (arg.startsWith("--confirm=")) {
      options.confirm = arg.slice("--confirm=".length);
      return;
    }

    throw new Error(`Unsupported option: ${arg}`);
  });

  if (!["plan", "write"].includes(options.mode)) {
    throw new Error("Mode must be plan or write.");
  }

  if (options.mode === "write") {
    if (options.confirm !== APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION) {
      throw new Error(
        `Framed print variant creation requires --confirm=${APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION}.`
      );
    }
  } else if (options.confirm) {
    throw new Error("Plan mode does not accept a confirmation flag.");
  }

  return {
    input: options.input ?? DEFAULT_PLAN_INPUT_PATH,
    output: options.output ?? DEFAULT_OUTPUT_PATH,
    mode: options.mode,
    confirm: options.confirm ?? null,
  };
};

const createSafetySummary = (options) => ({
  requestedMode: options.mode,
  confirmationRequired:
    options.mode === "write" ? APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION : null,
  confirmationPresent:
    options.mode === "write" &&
    options.confirm === APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION,
  callsShopifyAdmin: options.mode === "write",
  shopifyMutationsAllowed: options.mode === "write",
  shopifyVariantCreatesAllowed: options.mode === "write",
  shopifyOptionMutationsAllowed: options.mode === "write",
  shopifyPriceWritesAllowed: options.mode === "write",
  shopifyPublicationWritesAllowed: false,
  mongoWritesAllowed: false,
  cloudinaryWritesAllowed: false,
  checkoutCartBehaviorAdded: false,
  tokensPersisted: false,
  mutatesShopify: options.mode === "write",
  mutatesMongoDB: false,
  mutatesCloudinary: false,
  changesPrices: options.mode === "write",
  createsVariants: options.mode === "write",
  mutatesPublications: false,
  mutatesCheckoutOrCart: false,
});

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeOption = (option) => ({
  id: option?.id ?? null,
  name: normalizeString(option?.name) || null,
  values: Array.isArray(option?.values)
    ? option.values.filter((value) => typeof value === "string")
    : [],
});

const findOption = (product, optionName) =>
  (product?.options ?? [])
    .map(normalizeOption)
    .find((option) => option.name === optionName) ?? null;

const createWarning = (code, message, extra = {}) => ({
  code,
  message,
  ...extra,
});

const validateVariantPlan = (plan) => {
  if (!plan || typeof plan !== "object") {
    throw new Error("Invalid variant plan: expected an object.");
  }

  if (plan.mode !== "read_only_framed_print_variant_plan") {
    throw new Error(
      "Invalid variant plan: expected read_only_framed_print_variant_plan mode."
    );
  }

  if (plan.safety?.readOnly !== true) {
    throw new Error("Invalid variant plan: expected read-only safety.");
  }

  if (!Array.isArray(plan.products)) {
    throw new Error("Invalid variant plan: expected products array.");
  }

  const summary = plan.summary ?? {};
  const blockers = [
    ["manualReview", "manual-review rows"],
    ["queryErrorCount", "Shopify read errors"],
    ["missingFormulaRows", "missing formula rows"],
    ["missingShopifyProductIds", "missing Shopify product IDs"],
    ["duplicateVariantCombinationWarnings", "duplicate variant warnings"],
  ];

  blockers.forEach(([key, label]) => {
    if ((summary[key] ?? 0) > 0) {
      throw new Error(`Variant plan has ${label}.`);
    }
  });

  if ((summary.createMissingVariant ?? 0) < 1) {
    throw new Error("Variant plan has no missing variants to create.");
  }

  return plan;
};

const targetNeedsCreate = (target) =>
  target?.recommendedAction === "create_missing_variant";

const createVariantInput = ({ target, frameOption, matOption }) => ({
  price: target.expectedPrice,
  inventoryPolicy: "DENY",
  optionValues: [
    {
      name: target.framePackage,
      optionId: frameOption.id,
    },
    {
      name: target.mat,
      optionId: matOption.id,
    },
  ],
});

const createTargetResult = ({ target, frameOption, matOption }) => ({
  framePackage: target.framePackage,
  frameProfileId: target.frameProfileId,
  mat: target.mat,
  matProfileId: target.matProfileId,
  expectedPrice: target.expectedPrice,
  currencyCode: target.currencyCode,
  measurement: target.measurement ?? null,
  geometry: target.geometry ?? null,
  pricing: target.pricing ?? null,
  mutationInput: createVariantInput({ target, frameOption, matOption }),
});

const buildProductWritePlan = (productRow) => {
  const warnings = [];
  const currentProduct = productRow.currentShopifyProduct;
  const frameOption = findOption(currentProduct, FRAME_PACKAGE_OPTION_NAME);
  const matOption = findOption(currentProduct, MAT_OPTION_NAME);
  const createTargets = (productRow.approvedTargetVariants ?? []).filter(
    targetNeedsCreate
  );

  if (!currentProduct?.id) {
    warnings.push(
      createWarning(
        "missing_current_shopify_product",
        "Product row lacks current Shopify product state."
      )
    );
  }

  if (!frameOption?.id) {
    warnings.push(
      createWarning(
        "missing_frame_package_option",
        "Product lacks a Frame package option ID."
      )
    );
  }

  const requiresMatOption = createTargets.some((target) => target.mat);
  const optionMutation =
    requiresMatOption && !matOption
      ? {
          mutation: "productOptionsCreate",
          variantStrategy: "LEAVE_AS_IS",
          options: [
            {
              name: MAT_OPTION_NAME,
              values: [{ name: "No mat" }, { name: "White mat" }],
            },
          ],
        }
      : null;

  const plannedMatOption =
    matOption ??
    (optionMutation
      ? {
          id: null,
          name: MAT_OPTION_NAME,
          values: ["No mat", "White mat"],
          requiresIdAfterOptionMutation: true,
        }
      : null);

  if (requiresMatOption && !plannedMatOption) {
    warnings.push(
      createWarning("missing_mat_option", "Product lacks a Mat option.")
    );
  }

  return {
    artworkId: productRow.artworkId,
    artworkTitle: productRow.artworkTitle,
    artworkNumber: productRow.artworkNumber,
    productId: currentProduct?.id ?? productRow.selectedProduct?.gid ?? null,
    legacyResourceId:
      currentProduct?.legacyResourceId ?? productRow.selectedProduct?.productId ?? null,
    handle: currentProduct?.handle ?? productRow.selectedProduct?.handle ?? null,
    adminUrl: currentProduct?.adminUrl ?? productRow.selectedProduct?.adminUrl ?? null,
    currentStatus: currentProduct?.status ?? null,
    optionMutation,
    createVariantTargets:
      warnings.length === 0 && frameOption && plannedMatOption
        ? createTargets.map((target) =>
            createTargetResult({
              target,
              frameOption,
              matOption: plannedMatOption,
            })
          )
        : [],
    preservedVariants: (productRow.approvedTargetVariants ?? []).filter(
      (target) => target.recommendedAction === "preserve_existing_variant"
    ).length,
    warnings,
  };
};

const summarizeWritePlans = (products) => ({
  productsPlanned: products.length,
  productsWithWarnings: products.filter((product) => product.warnings.length > 0)
    .length,
  optionCreateMutationsPlanned: products.filter(
    (product) => product.optionMutation
  ).length,
  variantCreateMutationsPlanned: products.filter(
    (product) => product.createVariantTargets.length > 0
  ).length,
  variantsToCreate: products.reduce(
    (count, product) => count + product.createVariantTargets.length,
    0
  ),
  preservedExistingVariants: products.reduce(
    (count, product) => count + product.preservedVariants,
    0
  ),
});

const buildFramedPrintVariantWriteReport = ({
  plan,
  options,
  source,
  generatedAt,
  writeResults = [],
}) => {
  const validatedPlan = validateVariantPlan(plan);
  const products = validatedPlan.products.map(buildProductWritePlan);
  const summary = summarizeWritePlans(products);

  if (summary.productsWithWarnings > 0) {
    throw new Error("Write plan has product warnings.");
  }

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode:
      options.mode === "write"
        ? "framed_print_variant_write"
        : "framed_print_variant_write_plan",
    source,
    safety: createSafetySummary(options),
    confirmation: {
      required:
        options.mode === "write"
          ? APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION
          : null,
      present:
        options.mode === "write" &&
        options.confirm === APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION,
    },
    ownerApprovalSnapshot: validatedPlan.ownerApprovalSnapshot,
    approvedMatrix: validatedPlan.approvedMatrix,
    summary: {
      ...summary,
      writeResults: writeResults.length,
      writeFailures: writeResults.filter((result) => result.status === "failed")
        .length,
    },
    products,
    writeResults,
    noMutationStatement:
      options.mode === "write"
        ? "This report records a confirmed Shopify variant write. It does not publish products, change product status, mutate MongoDB, mutate Cloudinary, or add checkout/cart behavior."
        : "This report is a local write plan only. It does not call Shopify, create variants, write prices, publish products, change product status, mutate MongoDB, mutate Cloudinary, or add checkout/cart behavior.",
  };
};

const redactWriteError = (error, sensitiveValues = []) =>
  redactSensitiveText(error, sensitiveValues).replace(
    TOKEN_LIKE_PATTERN,
    "[REDACTED]"
  );

module.exports = {
  APPLY_FRAMED_PRINT_VARIANTS_CONFIRMATION,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_PLAN_INPUT_PATH,
  FRAME_PACKAGE_OPTION_NAME,
  MAT_OPTION_NAME,
  buildFramedPrintVariantWriteReport,
  createAdminGraphqlUrl,
  createSafetySummary,
  parseArgs,
  redactWriteError,
  validateRequiredEnv,
};
