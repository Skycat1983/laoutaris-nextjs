const {
  createAdminGraphqlUrl,
  redactSensitiveText,
} = require("./reconcile-shopify-catalog-plan-helpers.cjs");

const DEFAULT_PLAN_INPUT_PATH = "reports/shopify-catalog-dry-run-plan.json";
const DEFAULT_RECONCILIATION_INPUT_PATH =
  "reports/shopify-catalog-reconciliation-report.json";
const DEFAULT_APPROVAL_INPUT_PATH =
  "reports/shopify-catalog-full-owner-approval.json";
const DEFAULT_DRAFT_OUTPUT_PATH =
  "reports/shopify-catalog-draft-create-report.json";
const CREATE_DRAFTS_CONFIRMATION = "CREATE_FULL_CATALOG_DRAFT_PRODUCTS";
const REQUIRED_ADMIN_API_VERSION = "2026-04";
const ORIGINAL_QUANTITY = 1;
const DEFAULT_PRINT_QUANTITY = 50;
const SHOPIFY_LOCATION_GID_PATTERN = /^gid:\/\/shopify\/Location\/\d+$/;
const SHOPIFY_PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/(\d+)$/;

const PRODUCT_SET_MUTATION = `
  mutation CreateShopifyCatalogDraftProduct($productSet: ProductSetInput!, $synchronous: Boolean!) {
    productSet(input: $productSet, synchronous: $synchronous) {
      product {
        id
        legacyResourceId
        handle
        title
        status
        productType
        totalInventory
        metafield(namespace: "custom", key: "mongodb_artwork_id") {
          namespace
          key
          value
        }
        media(first: 5) {
          nodes {
            id
            alt
            mediaContentType
            status
          }
        }
        variants(first: 5) {
          nodes {
            id
            legacyResourceId
            title
            price
            inventoryQuantity
            inventoryPolicy
            selectedOptions {
              name
              value
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

const PRODUCT_FAMILY_DEFINITIONS = {
  original: {
    optionName: "Title",
    optionValue: "Default Title",
    inventoryQuantity: ORIGINAL_QUANTITY,
  },
  print: {
    optionName: "Frame package",
    optionValue: "Unframed",
    inventoryQuantity: DEFAULT_PRINT_QUANTITY,
  },
};

const parseArgs = (argv) => {
  const options = {};

  argv.forEach((arg) => {
    if (arg.startsWith("--plan=")) {
      options.plan = arg.slice("--plan=".length);
      return;
    }

    if (arg.startsWith("--reconciliation=")) {
      options.reconciliation = arg.slice("--reconciliation=".length);
      return;
    }

    if (arg.startsWith("--approval=")) {
      options.approval = arg.slice("--approval=".length);
      return;
    }

    if (arg.startsWith("--output=")) {
      options.output = arg.slice("--output=".length);
      return;
    }

    if (arg.startsWith("--confirm=")) {
      options.confirm = arg.slice("--confirm=".length);
      return;
    }

    throw new Error(`Unsupported option: ${arg}`);
  });

  return options;
};

const validateExecutionOptions = (options) => {
  if (options.confirm !== CREATE_DRAFTS_CONFIRMATION) {
    throw new Error(
      `Full catalog draft creation requires --confirm=${CREATE_DRAFTS_CONFIRMATION}.`
    );
  }

  return options;
};

const validateRequiredEnv = (env) => {
  const normalized = {
    shopDomain: String(env.SHOPIFY_STORE_DOMAIN ?? "").trim(),
    adminApiVersion: String(env.SHOPIFY_ADMIN_API_VERSION ?? "").trim(),
    adminAccessToken: String(env.SHOPIFY_ADMIN_ACCESS_TOKEN ?? "").trim(),
  };
  const missing = [];

  if (!normalized.shopDomain) {
    missing.push("SHOPIFY_STORE_DOMAIN");
  }

  if (!normalized.adminApiVersion) {
    missing.push("SHOPIFY_ADMIN_API_VERSION");
  }

  if (!normalized.adminAccessToken) {
    missing.push("SHOPIFY_ADMIN_ACCESS_TOKEN");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required Shopify Admin environment variables: ${missing.join(
        ", "
      )}.`
    );
  }

  if (
    normalized.shopDomain.startsWith("http://") ||
    normalized.shopDomain.startsWith("https://")
  ) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN must be the .myshopify.com domain without protocol."
    );
  }

  if (normalized.adminApiVersion !== REQUIRED_ADMIN_API_VERSION) {
    throw new Error(
      `SHOPIFY_ADMIN_API_VERSION must be ${REQUIRED_ADMIN_API_VERSION} for the full catalog draft command.`
    );
  }

  return normalized;
};

const normalizePrice = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    throw new Error(`Approval file is missing ${fieldName}.`);
  }

  const raw = typeof value === "number" ? String(value) : String(value).trim();
  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Approval file has invalid ${fieldName}.`);
  }

  return parsed.toFixed(2);
};

const normalizePrintQuantity = (value) => {
  if (value === undefined || value === null || value === "") {
    return DEFAULT_PRINT_QUANTITY;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Approval file has invalid print edition quantity.");
  }

  return parsed;
};

const normalizeMongoLinkingDecision = (approval) => {
  const value =
    approval?.mongoDbLinking ??
    approval?.mongodbLinking ??
    approval?.mongoDBLinking ??
    approval?.writeMongoDbLinks ??
    approval?.writeMongoDBLinks;

  if (value === false) {
    return "none";
  }

  const normalized = String(value ?? "").trim().toLowerCase();

  if (["none", "no", "no_write", "no-writes", "skip", "false"].includes(normalized)) {
    return "none";
  }

  throw new Error("Approval file must explicitly keep MongoDB linking disabled.");
};

const validateApprovalInput = (approval) => {
  if (!approval || typeof approval !== "object") {
    throw new Error("Invalid approval file: expected an object.");
  }

  const fullCatalogApproved =
    approval.fullCatalogApproval === true ||
    approval.approvedScope === "all_planned_no_match_products";

  if (!fullCatalogApproved) {
    throw new Error(
      "Approval file must explicitly approve all planned no-match products."
    );
  }

  const status = String(approval.productStatus ?? approval.status ?? "").trim();

  if (status !== "DRAFT") {
    throw new Error("Approval file must explicitly set product status to DRAFT.");
  }

  const inventoryLocationId = String(
    approval.inventoryLocationId ??
      approval.inventoryLocationGid ??
      approval.inventoryLocationGID ??
      ""
  ).trim();

  if (!SHOPIFY_LOCATION_GID_PATTERN.test(inventoryLocationId)) {
    throw new Error(
      "Approval file must include a valid Shopify inventory location GID."
    );
  }

  return {
    ...approval,
    fullCatalogApproval: true,
    approvedScope: "all_planned_no_match_products",
    productStatus: status,
    mongoDbLinking: normalizeMongoLinkingDecision(approval),
    inventoryLocationId,
    inventoryLocationName:
      typeof approval.inventoryLocationName === "string"
        ? approval.inventoryLocationName.trim() || null
        : null,
    originalPrice: normalizePrice(approval.originalPrice, "originalPrice"),
    printPrice: normalizePrice(approval.printPrice, "printPrice"),
    printEditionQuantity: normalizePrintQuantity(
      approval.printEditionQuantity ?? approval.printInventoryQuantity
    ),
    expectedArtworkCount:
      approval.expectedArtworkCount === undefined
        ? null
        : Number(approval.expectedArtworkCount),
    expectedProductCount:
      approval.expectedProductCount === undefined
        ? null
        : Number(approval.expectedProductCount),
  };
};

const validatePlanInput = (plan) => {
  if (!plan || typeof plan !== "object" || !Array.isArray(plan.artworks)) {
    throw new Error("Invalid plan input: expected an artworks array.");
  }

  return plan;
};

const validateReconciliationInput = (reconciliation) => {
  if (
    !reconciliation ||
    typeof reconciliation !== "object" ||
    !Array.isArray(reconciliation.artworks)
  ) {
    throw new Error("Invalid reconciliation report: expected an artworks array.");
  }

  if (reconciliation.mode !== "read_only_shopify_reconciliation") {
    throw new Error(
      "Invalid reconciliation report: expected read_only_shopify_reconciliation mode."
    );
  }

  if (reconciliation.safety?.readOnly !== true) {
    throw new Error("Invalid reconciliation report: expected read-only safety.");
  }

  const summary = reconciliation.summary ?? {};

  if ((summary.plannedProductsWithConflict ?? 0) > 0) {
    throw new Error("Reconciliation report has conflicts.");
  }

  if ((summary.queryErrorCount ?? 0) > 0) {
    throw new Error("Reconciliation report has query errors.");
  }

  if ((summary.manualReviewCount ?? 0) > 0) {
    throw new Error("Reconciliation report has manual-review blockers.");
  }

  return reconciliation;
};

const findReconciliationArtwork = (reconciliation, artworkId) =>
  reconciliation.artworks.find(
    (artwork) =>
      artwork?.customMongodbArtworkId === artworkId ||
      artwork?.artworkId === artworkId
  );

const getReconciliationProduct = (artwork, family, proposedHandle) =>
  (artwork?.products ?? []).find(
    (product) =>
      product?.productFamily === family &&
      product?.proposedHandle === proposedHandle
  );

const assertCleanReconciliationProduct = ({
  artworkId,
  family,
  reconciliationProduct,
}) => {
  if (!reconciliationProduct) {
    throw new Error(
      `Artwork ${artworkId} lacks a ${family} reconciliation row.`
    );
  }

  if (
    reconciliationProduct.matchStatus !== "no_match" ||
    reconciliationProduct.recommendedAction !== "safe_to_create_later"
  ) {
    throw new Error(`Artwork ${artworkId} ${family} is not clean to create.`);
  }

  if (
    reconciliationProduct.handleMatch ||
    (reconciliationProduct.metafieldMatches ?? []).length > 0 ||
    (reconciliationProduct.manualNumberMatches ?? []).length > 0
  ) {
    throw new Error(`Artwork ${artworkId} ${family} already has a Shopify match.`);
  }

  if ((reconciliationProduct.conflicts ?? []).length > 0) {
    throw new Error(`Artwork ${artworkId} ${family} has reconciliation conflicts.`);
  }

  if (
    (reconciliationProduct.warnings ?? []).some(
      (warning) => warning?.code === "shopify_query_error"
    )
  ) {
    throw new Error(`Artwork ${artworkId} ${family} has reconciliation query errors.`);
  }
};

const getArtworkImageUrl = (artwork, product) => {
  const imageUrl =
    product?.media?.[0]?.sourceUrl ??
    artwork?.imageUrl ??
    artwork?.archiveImageUrl ??
    artwork?.image?.secure_url ??
    artwork?.image?.url;

  return typeof imageUrl === "string" && imageUrl.trim()
    ? imageUrl.trim()
    : null;
};

const assertValidImageUrl = ({ artworkId, family, imageUrl }) => {
  let url;

  try {
    url = new URL(imageUrl);
  } catch {
    throw new Error(`Artwork ${artworkId} ${family} lacks a valid image URL.`);
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`Artwork ${artworkId} ${family} lacks a valid image URL.`);
  }
};

const normalizeMetafields = (metafields) => {
  if (!Array.isArray(metafields)) {
    return [];
  }

  return metafields.map((metafield) => ({
    namespace: String(metafield.namespace ?? "").trim(),
    key: String(metafield.key ?? "").trim(),
    type: String(metafield.type ?? "").trim(),
    value:
      typeof metafield.value === "string"
        ? metafield.value
        : String(metafield.value),
  }));
};

const buildSelectedProducts = ({ plan, reconciliation, approval }) => {
  const validPlan = validatePlanInput(plan);
  const validReconciliation = validateReconciliationInput(reconciliation);
  const validApproval = validateApprovalInput(approval);
  const selectedProducts = [];
  const selectedArtworks = [];

  validPlan.artworks.forEach((artwork) => {
    const artworkId = String(
      artwork?.customMongodbArtworkId ?? artwork?.artworkId ?? ""
    ).trim();

    if (!artworkId) {
      throw new Error("Dry-run plan contains an artwork without an ID.");
    }

    if ((artwork.warnings ?? []).length > 0) {
      throw new Error(`Artwork ${artworkId} has dry-run warnings.`);
    }

    const reconciliationArtwork = findReconciliationArtwork(
      validReconciliation,
      artworkId
    );

    if (!reconciliationArtwork) {
      throw new Error(
        `Artwork ${artworkId} is missing from the reconciliation report.`
      );
    }

    const title = String(artwork.title ?? "").trim();

    if (!title) {
      throw new Error(`Artwork ${artworkId} lacks a usable title.`);
    }

    selectedArtworks.push({
      artworkId,
      title,
      inventoryLocationId: validApproval.inventoryLocationId,
      inventoryLocationName: validApproval.inventoryLocationName,
      status: validApproval.productStatus,
      mongoDbLinking: validApproval.mongoDbLinking,
      originalPrice: validApproval.originalPrice,
      printPrice: validApproval.printPrice,
      printEditionQuantity: validApproval.printEditionQuantity,
    });

    ["original", "print"].forEach((family) => {
      const planProduct = (artwork.products ?? []).find(
        (product) => product?.productFamily === family
      );

      if (!planProduct) {
        throw new Error(`Artwork ${artworkId} lacks a ${family} product.`);
      }

      if ((planProduct.warnings ?? []).length > 0) {
        throw new Error(`Artwork ${artworkId} ${family} product has dry-run warnings.`);
      }

      const imageUrl = getArtworkImageUrl(artwork, planProduct);
      assertValidImageUrl({ artworkId, family, imageUrl });

      const reconciliationProduct = getReconciliationProduct(
        reconciliationArtwork,
        family,
        planProduct.proposedHandle
      );

      assertCleanReconciliationProduct({
        artworkId,
        family,
        reconciliationProduct,
      });

      selectedProducts.push({
        artworkId,
        artworkTitle: title,
        productFamily: family,
        proposedHandle: planProduct.proposedHandle,
        title: planProduct.title,
        vendor: planProduct.vendor ?? "Joseph Laoutaris",
        productType: planProduct.productType,
        tags: Array.isArray(planProduct.tags) ? planProduct.tags : [],
        status: "DRAFT",
        price:
          family === "original"
            ? validApproval.originalPrice
            : validApproval.printPrice,
        inventoryQuantity:
          family === "original"
            ? ORIGINAL_QUANTITY
            : validApproval.printEditionQuantity,
        inventoryLocationId: validApproval.inventoryLocationId,
        inventoryLocationName: validApproval.inventoryLocationName,
        imageUrl,
        mediaAlt: planProduct.media?.[0]?.alt ?? planProduct.title,
        metafields: normalizeMetafields(planProduct.metafields),
      });
    });
  });

  if (
    validApproval.expectedArtworkCount !== null &&
    selectedArtworks.length !== validApproval.expectedArtworkCount
  ) {
    throw new Error("Approval expected artwork count does not match the plan.");
  }

  if (
    validApproval.expectedProductCount !== null &&
    selectedProducts.length !== validApproval.expectedProductCount
  ) {
    throw new Error("Approval expected product count does not match the plan.");
  }

  return {
    approval: validApproval,
    selectedArtworks,
    selectedProducts,
  };
};

const createSafetySummary = ({ approval, products }) => ({
  confirmationRequired: CREATE_DRAFTS_CONFIRMATION,
  confirmationPresent: true,
  approvedScope: approval.approvedScope,
  approvedArtworkCount: products.length / 2,
  maxProductsToCreate: products.length,
  draftOnly: true,
  publicationWritesAllowed: false,
  shopifyMutationsAllowed: true,
  shopifyMutation: "productSet(status: DRAFT)",
  mongoWritesAllowed: false,
  cloudinaryWritesAllowed: false,
  tokensPersisted: false,
});

const summarizeProducts = (products) => ({
  approvedArtworks: products.length / 2,
  productsPlanned: products.length,
  productsPending: products.filter(
    (product) => product.action === "pending_create"
  ).length,
  productsAttempted: products.filter((product) =>
    ["create_product", "created", "create_failed"].includes(product.action)
  ).length,
  productsCreated: products.filter((product) => product.action === "created")
    .length,
  productsFailed: products.filter((product) => product.action === "create_failed")
    .length,
  productsSkipped: products.filter(
    (product) => product.action === "skipped_after_failure"
  ).length,
  userErrorCount: products.reduce(
    (total, product) => total + (product.userErrors?.length ?? 0),
    0
  ),
});

const createReportProductEntry = (selectedProduct) => ({
  artworkId: selectedProduct.artworkId,
  artworkTitle: selectedProduct.artworkTitle,
  productFamily: selectedProduct.productFamily,
  proposedHandle: selectedProduct.proposedHandle,
  title: selectedProduct.title,
  vendor: selectedProduct.vendor,
  productType: selectedProduct.productType,
  tags: selectedProduct.tags,
  status: selectedProduct.status,
  price: selectedProduct.price,
  inventoryQuantity: selectedProduct.inventoryQuantity,
  inventoryPolicy: "DENY",
  inventoryLocationId: selectedProduct.inventoryLocationId,
  inventoryLocationName: selectedProduct.inventoryLocationName,
  imageSource: selectedProduct.imageUrl,
  metafields: selectedProduct.metafields,
  printVariantOption:
    selectedProduct.productFamily === "print"
      ? {
          name: PRODUCT_FAMILY_DEFINITIONS.print.optionName,
          value: PRODUCT_FAMILY_DEFINITIONS.print.optionValue,
        }
      : null,
  action: "pending_create",
  shopifyMutation: {
    name: "productSet",
    variables: createProductSetVariables(selectedProduct),
  },
  shopifyResult: null,
  imageAttachmentResult: null,
  metafieldResult: null,
  inventoryResult: null,
  userErrors: [],
  error: null,
});

function createProductSetVariables(selectedProduct) {
  const definition = PRODUCT_FAMILY_DEFINITIONS[selectedProduct.productFamily];
  const fileInput = {
    originalSource: selectedProduct.imageUrl,
    alt: selectedProduct.mediaAlt || selectedProduct.title,
    contentType: "IMAGE",
  };

  return {
    synchronous: true,
    productSet: {
      title: selectedProduct.title,
      handle: selectedProduct.proposedHandle,
      status: "DRAFT",
      productType: selectedProduct.productType,
      vendor: selectedProduct.vendor,
      tags: selectedProduct.tags,
      metafields: selectedProduct.metafields,
      productOptions: [
        {
          name: definition.optionName,
          position: 1,
          values: [{ name: definition.optionValue }],
        },
      ],
      files: [fileInput],
      variants: [
        {
          optionValues: [
            {
              optionName: definition.optionName,
              name: definition.optionValue,
            },
          ],
          file: fileInput,
          price: selectedProduct.price,
          inventoryPolicy: "DENY",
          inventoryQuantities: [
            {
              locationId: selectedProduct.inventoryLocationId,
              name: "available",
              quantity: selectedProduct.inventoryQuantity,
            },
          ],
        },
      ],
    },
  };
}

const buildDraftCreateReport = ({
  plan,
  reconciliation,
  approval,
  source,
  generatedAt,
}) => {
  const selection = buildSelectedProducts({ plan, reconciliation, approval });
  const products = selection.selectedProducts.map(createReportProductEntry);

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode: "shopify_catalog_full_draft_creation",
    source,
    safety: createSafetySummary({ approval: selection.approval, products }),
    selectedArtworks: selection.selectedArtworks,
    summary: summarizeProducts(products),
    products,
    noMutationStatement:
      "This command does not mutate MongoDB or Cloudinary and does not publish Shopify products.",
  };
};

const getLegacyResourceId = (product) => {
  if (product?.legacyResourceId !== undefined && product.legacyResourceId !== null) {
    return String(product.legacyResourceId);
  }

  const match =
    typeof product?.id === "string" ? product.id.match(SHOPIFY_PRODUCT_GID_PATTERN) : null;

  return match?.[1] ?? null;
};

const normalizeCreatedProduct = (product, shopDomain) => {
  if (!product) {
    return null;
  }

  const legacyResourceId = getLegacyResourceId(product);
  const result = {
    id: typeof product.id === "string" ? product.id : null,
    legacyResourceId,
    handle: typeof product.handle === "string" ? product.handle : null,
    title: typeof product.title === "string" ? product.title : null,
    status: typeof product.status === "string" ? product.status : null,
    productType:
      typeof product.productType === "string" ? product.productType : null,
    totalInventory:
      typeof product.totalInventory === "number" ? product.totalInventory : null,
    customMongodbArtworkId:
      typeof product.metafield?.value === "string"
        ? product.metafield.value
        : null,
    media: (product.media?.nodes ?? []).map((media) => ({
      id: media?.id ?? null,
      alt: media?.alt ?? null,
      mediaContentType: media?.mediaContentType ?? null,
      status: media?.status ?? null,
    })),
    variants: (product.variants?.nodes ?? []).map((variant) => ({
      id: variant?.id ?? null,
      legacyResourceId: getLegacyResourceId(variant),
      title: variant?.title ?? null,
      price: variant?.price ?? null,
      inventoryQuantity:
        typeof variant?.inventoryQuantity === "number"
          ? variant.inventoryQuantity
          : null,
      inventoryPolicy: variant?.inventoryPolicy ?? null,
      selectedOptions: variant?.selectedOptions ?? [],
    })),
  };

  if (legacyResourceId && shopDomain) {
    result.adminUrl = `https://${shopDomain}/admin/products/${legacyResourceId}`;
  }

  return result;
};

const applyProductSetSuccess = ({ report, productIndex, payload, shopDomain }) => {
  const entry = report.products[productIndex];
  const userErrors = payload?.userErrors ?? [];

  entry.action = "create_product";

  if (userErrors.length > 0) {
    entry.action = "create_failed";
    entry.userErrors = userErrors;
    entry.error = {
      code: "shopify_user_errors",
      message: "Shopify productSet returned user errors.",
    };
    report.summary = summarizeProducts(report.products);
    return false;
  }

  const createdProduct = normalizeCreatedProduct(payload?.product, shopDomain);

  if (!createdProduct?.id) {
    entry.action = "create_failed";
    entry.error = {
      code: "missing_created_product",
      message: "Shopify productSet did not return a created product.",
    };
    report.summary = summarizeProducts(report.products);
    return false;
  }

  entry.action = "created";
  entry.shopifyResult = createdProduct;
  entry.imageAttachmentResult = {
    source: entry.imageSource,
    media: createdProduct.media,
  };
  entry.metafieldResult = {
    namespace: "custom",
    key: "mongodb_artwork_id",
    value: createdProduct.customMongodbArtworkId,
    expectedValue: entry.artworkId,
    matchesExpected: createdProduct.customMongodbArtworkId === entry.artworkId,
  };
  entry.inventoryResult = {
    expectedQuantity: entry.inventoryQuantity,
    productTotalInventory: createdProduct.totalInventory,
    variants: createdProduct.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      inventoryQuantity: variant.inventoryQuantity,
      inventoryPolicy: variant.inventoryPolicy,
      selectedOptions: variant.selectedOptions,
    })),
  };
  report.summary = summarizeProducts(report.products);
  return true;
};

const applyProductSetFailure = ({ report, productIndex, error, sensitiveValues }) => {
  const entry = report.products[productIndex];

  entry.action = "create_failed";
  entry.error = {
    code: "shopify_mutation_failed",
    message: redactSensitiveText(error, sensitiveValues),
  };
  report.summary = summarizeProducts(report.products);
};

const markRemainingProductsSkipped = (report, startIndex) => {
  report.products.slice(startIndex).forEach((entry) => {
    if (entry.action === "pending_create") {
      entry.action = "skipped_after_failure";
      entry.error = {
        code: "stopped_after_prior_failure",
        message:
          "Full catalog draft creation stopped after an earlier product failed or returned user errors.",
      };
    }
  });
  report.summary = summarizeProducts(report.products);
};

const hasDraftCreateFailures = (report) =>
  report.summary.productsFailed > 0 || report.summary.productsSkipped > 0;

module.exports = {
  CREATE_DRAFTS_CONFIRMATION,
  DEFAULT_APPROVAL_INPUT_PATH,
  DEFAULT_DRAFT_OUTPUT_PATH,
  DEFAULT_PLAN_INPUT_PATH,
  DEFAULT_PRINT_QUANTITY,
  DEFAULT_RECONCILIATION_INPUT_PATH,
  ORIGINAL_QUANTITY,
  PRODUCT_SET_MUTATION,
  applyProductSetFailure,
  applyProductSetSuccess,
  buildDraftCreateReport,
  buildSelectedProducts,
  createAdminGraphqlUrl,
  createProductSetVariables,
  hasDraftCreateFailures,
  markRemainingProductsSkipped,
  parseArgs,
  redactSensitiveText,
  validateApprovalInput,
  validateExecutionOptions,
  validateRequiredEnv,
};
