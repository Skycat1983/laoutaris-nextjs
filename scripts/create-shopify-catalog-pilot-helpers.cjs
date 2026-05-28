const {
  createAdminGraphqlUrl,
  redactSensitiveText,
} = require("./reconcile-shopify-catalog-plan-helpers.cjs");

const DEFAULT_PLAN_INPUT_PATH = "reports/shopify-catalog-dry-run-plan.json";
const DEFAULT_RECONCILIATION_INPUT_PATH =
  "reports/shopify-catalog-reconciliation-report.json";
const DEFAULT_APPROVAL_INPUT_PATH =
  "reports/shopify-catalog-pilot-owner-approval.json";
const DEFAULT_PILOT_OUTPUT_PATH =
  "reports/shopify-catalog-pilot-create-report.json";
const CREATE_PILOT_CONFIRMATION = "CREATE_DRAFT_PILOT_PRODUCTS";
const REQUIRED_ADMIN_API_VERSION = "2026-04";
const APPROVED_ARTWORK_COUNT = 5;
const ORIGINAL_QUANTITY = 1;
const DEFAULT_PRINT_QUANTITY = 50;
const SHOPIFY_PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/(\d+)$/;
const SHOPIFY_LOCATION_GID_PATTERN = /^gid:\/\/shopify\/Location\/\d+$/;

const PRODUCT_SET_MUTATION = `
  mutation CreateShopifyCatalogPilotProduct($productSet: ProductSetInput!, $synchronous: Boolean!) {
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
    productType: "Original Artwork",
    tags: ["original", "painting", "archive-artwork"],
    titleSuffix: "Original Artwork",
    inventoryQuantity: ORIGINAL_QUANTITY,
    optionName: "Title",
    optionValue: "Default Title",
  },
  print: {
    productType: "Fine Art Print",
    tags: ["print", "fine-art-print", "archive-artwork"],
    titleSuffix: "Fine Art Print",
    inventoryQuantity: DEFAULT_PRINT_QUANTITY,
    optionName: "Frame package",
    optionValue: "Unframed",
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
  if (options.confirm !== CREATE_PILOT_CONFIRMATION) {
    throw new Error(
      `Pilot creation requires --confirm=${CREATE_PILOT_CONFIRMATION}.`
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
      `SHOPIFY_ADMIN_API_VERSION must be ${REQUIRED_ADMIN_API_VERSION} for the pilot command.`
    );
  }

  return normalized;
};

const getApprovalItems = (approval) => {
  if (Array.isArray(approval)) {
    return approval;
  }

  if (Array.isArray(approval?.artworks)) {
    return approval.artworks;
  }

  if (Array.isArray(approval?.approvedArtworks)) {
    return approval.approvedArtworks;
  }

  throw new Error("Invalid approval file: expected an artworks array.");
};

const getArtworkIdFromApproval = (item) =>
  String(
    item?.mongodbArtworkId ??
      item?.mongoDbArtworkId ??
      item?.mongoDBArtworkId ??
      item?.artworkId ??
      item?._id ??
      ""
  ).trim();

const normalizePrice = (value, fieldName, artworkId) => {
  if (value === undefined || value === null || value === "") {
    throw new Error(
      `Approval for artwork ${artworkId} is missing ${fieldName}.`
    );
  }

  const raw = typeof value === "number" ? String(value) : String(value).trim();
  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(
      `Approval for artwork ${artworkId} has invalid ${fieldName}.`
    );
  }

  return parsed.toFixed(2);
};

const normalizeStatus = (item, artworkId) => {
  const status = String(item?.productStatus ?? item?.status ?? "").trim();

  if (status !== "DRAFT") {
    throw new Error(
      `Approval for artwork ${artworkId} must explicitly set product status to DRAFT.`
    );
  }

  return status;
};

const normalizeApprovalTitle = (item, artworkId) => {
  const title = typeof item?.title === "string" ? item.title.trim() : "";

  if (!title) {
    throw new Error(
      `Approval for artwork ${artworkId} must include artwork title.`
    );
  }

  return title;
};

const normalizeMongoLinkingDecision = (item, artworkId) => {
  const value =
    item?.mongoDbLinking ??
    item?.mongodbLinking ??
    item?.mongoDBLinking ??
    item?.writeMongoDbLinks ??
    item?.writeMongoDBLinks;

  if (value === false) {
    return "none";
  }

  const normalized = String(value ?? "").trim().toLowerCase();

  if (["none", "no", "no_write", "no-writes", "skip", "false"].includes(normalized)) {
    return "none";
  }

  throw new Error(
    `Approval for artwork ${artworkId} must explicitly keep MongoDB linking disabled.`
  );
};

const normalizeLocationId = ({ item, approval, artworkId }) => {
  const locationId = String(
    item?.inventoryLocationId ??
      item?.inventoryLocationGid ??
      item?.inventoryLocationGID ??
      approval?.inventoryLocationId ??
      approval?.inventoryLocationGid ??
      approval?.inventoryLocationGID ??
      ""
  ).trim();

  if (!SHOPIFY_LOCATION_GID_PATTERN.test(locationId)) {
    throw new Error(
      `Approval for artwork ${artworkId} must include a valid Shopify inventory location GID.`
    );
  }

  return locationId;
};

const normalizePrintQuantity = (value, artworkId) => {
  if (value === undefined || value === null || value === "") {
    return DEFAULT_PRINT_QUANTITY;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(
      `Approval for artwork ${artworkId} has invalid print edition quantity.`
    );
  }

  return parsed;
};

const validateApprovalInput = (approval) => {
  const items = getApprovalItems(approval);

  if (items.length !== APPROVED_ARTWORK_COUNT) {
    throw new Error(
      `Approval file must contain exactly ${APPROVED_ARTWORK_COUNT} artworks.`
    );
  }

  const seenArtworkIds = new Set();
  const normalizedItems = items.map((item, index) => {
    const artworkId = getArtworkIdFromApproval(item);

    if (!artworkId) {
      throw new Error(`Approval artwork at index ${index} is missing artwork ID.`);
    }

    if (seenArtworkIds.has(artworkId)) {
      throw new Error(`Approval file contains duplicate artwork ID ${artworkId}.`);
    }

    seenArtworkIds.add(artworkId);

    return {
      artworkId,
      title: normalizeApprovalTitle(item, artworkId),
      status: normalizeStatus(item, artworkId),
      originalPrice: normalizePrice(
        item?.originalPrice,
        "originalPrice",
        artworkId
      ),
      printPrice: normalizePrice(item?.printPrice, "printPrice", artworkId),
      mongoDbLinking: normalizeMongoLinkingDecision(item, artworkId),
      inventoryLocationId: normalizeLocationId({ item, approval, artworkId }),
      inventoryLocationName:
        typeof (item?.inventoryLocationName ?? approval?.inventoryLocationName) ===
        "string"
          ? (item.inventoryLocationName ?? approval.inventoryLocationName).trim() ||
            null
          : null,
      printEditionQuantity: normalizePrintQuantity(
        item?.printEditionQuantity ?? item?.printInventoryQuantity,
        artworkId
      ),
    };
  });

  return {
    ...approval,
    artworks: normalizedItems,
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

  return reconciliation;
};

const findPlanArtwork = (plan, artworkId) =>
  plan.artworks.find(
    (artwork) =>
      artwork?.customMongodbArtworkId === artworkId ||
      artwork?.artworkId === artworkId
  );

const findReconciliationArtwork = (reconciliation, artworkId) =>
  reconciliation.artworks.find(
    (artwork) =>
      artwork?.customMongodbArtworkId === artworkId ||
      artwork?.artworkId === artworkId
  );

const getPlanProduct = (artwork, family) =>
  (artwork?.products ?? []).find((product) => product?.productFamily === family);

const getReconciliationProduct = (artwork, family, proposedHandle) =>
  (artwork?.products ?? []).find(
    (product) =>
      product?.productFamily === family &&
      product?.proposedHandle === proposedHandle
  );

const getArtworkImageUrl = (artwork) => {
  const imageUrl =
    artwork?.imageUrl ??
    artwork?.archiveImageUrl ??
    artwork?.image?.secure_url ??
    artwork?.image?.url;

  return typeof imageUrl === "string" && imageUrl.trim()
    ? imageUrl.trim()
    : null;
};

const assertCleanReconciliationProduct = ({
  artworkId,
  family,
  reconciliationProduct,
}) => {
  if (!reconciliationProduct) {
    throw new Error(
      `Selected artwork ${artworkId} lacks a ${family} reconciliation row.`
    );
  }

  if (
    reconciliationProduct.matchStatus !== "no_match" ||
    reconciliationProduct.recommendedAction !== "safe_to_create_later"
  ) {
    throw new Error(
      `Selected artwork ${artworkId} ${family} is not clean to create.`
    );
  }

  if (
    reconciliationProduct.handleMatch ||
    (reconciliationProduct.metafieldMatches ?? []).length > 0 ||
    (reconciliationProduct.manualNumberMatches ?? []).length > 0
  ) {
    throw new Error(
      `Selected artwork ${artworkId} ${family} already has a Shopify match.`
    );
  }

  if ((reconciliationProduct.conflicts ?? []).length > 0) {
    throw new Error(
      `Selected artwork ${artworkId} ${family} has reconciliation conflicts.`
    );
  }

  if (
    (reconciliationProduct.warnings ?? []).some(
      (warning) => warning?.code === "shopify_query_error"
    )
  ) {
    throw new Error(
      `Selected artwork ${artworkId} ${family} has reconciliation query errors.`
    );
  }
};

const buildSelectedProducts = ({ plan, reconciliation, approval }) => {
  const validPlan = validatePlanInput(plan);
  const validReconciliation = validateReconciliationInput(reconciliation);
  const validApproval = validateApprovalInput(approval);
  const selectedProducts = [];
  const selectedArtworks = [];

  validApproval.artworks.forEach((approvalArtwork) => {
    const planArtwork = findPlanArtwork(validPlan, approvalArtwork.artworkId);
    const reconciliationArtwork = findReconciliationArtwork(
      validReconciliation,
      approvalArtwork.artworkId
    );

    if (!planArtwork) {
      throw new Error(
        `Approved artwork ${approvalArtwork.artworkId} is missing from the dry-run plan.`
      );
    }

    if (!reconciliationArtwork) {
      throw new Error(
        `Approved artwork ${approvalArtwork.artworkId} is missing from the reconciliation report.`
      );
    }

    const imageUrl = getArtworkImageUrl(planArtwork);

    if (!imageUrl) {
      throw new Error(
        `Approved artwork ${approvalArtwork.artworkId} lacks an image URL in the dry-run plan.`
      );
    }

    const title = String(planArtwork.title ?? approvalArtwork.title ?? "").trim();

    if (!title) {
      throw new Error(
        `Approved artwork ${approvalArtwork.artworkId} lacks a usable title.`
      );
    }

    const artworkSelection = {
      artworkId: approvalArtwork.artworkId,
      title,
      ownerApprovedTitle: approvalArtwork.title,
      imageUrl,
      inventoryLocationId: approvalArtwork.inventoryLocationId,
      inventoryLocationName: approvalArtwork.inventoryLocationName,
      status: approvalArtwork.status,
      mongoDbLinking: approvalArtwork.mongoDbLinking,
      originalPrice: approvalArtwork.originalPrice,
      printPrice: approvalArtwork.printPrice,
      printEditionQuantity: approvalArtwork.printEditionQuantity,
    };

    selectedArtworks.push(artworkSelection);

    ["original", "print"].forEach((family) => {
      const planProduct = getPlanProduct(planArtwork, family);

      if (!planProduct) {
        throw new Error(
          `Approved artwork ${approvalArtwork.artworkId} lacks a ${family} product in the dry-run plan.`
        );
      }

      if ((planProduct.warnings ?? []).length > 0) {
        throw new Error(
          `Approved artwork ${approvalArtwork.artworkId} ${family} product has dry-run warnings.`
        );
      }

      const reconciliationProduct = getReconciliationProduct(
        reconciliationArtwork,
        family,
        planProduct.proposedHandle
      );

      assertCleanReconciliationProduct({
        artworkId: approvalArtwork.artworkId,
        family,
        reconciliationProduct,
      });

      selectedProducts.push({
        artworkId: approvalArtwork.artworkId,
        title,
        imageUrl,
        productFamily: family,
        proposedHandle: planProduct.proposedHandle,
        productType:
          planProduct.productType ?? PRODUCT_FAMILY_DEFINITIONS[family].productType,
        tags: Array.isArray(planProduct.tags)
          ? planProduct.tags
          : PRODUCT_FAMILY_DEFINITIONS[family].tags,
        price:
          family === "original"
            ? approvalArtwork.originalPrice
            : approvalArtwork.printPrice,
        inventoryQuantity:
          family === "original"
            ? ORIGINAL_QUANTITY
            : approvalArtwork.printEditionQuantity,
        inventoryLocationId: approvalArtwork.inventoryLocationId,
        inventoryLocationName: approvalArtwork.inventoryLocationName,
        status: "DRAFT",
      });
    });
  });

  if (selectedProducts.length !== APPROVED_ARTWORK_COUNT * 2) {
    throw new Error("Pilot selection must resolve to exactly 10 products.");
  }

  return {
    selectedArtworks,
    selectedProducts,
  };
};

const createSafetySummary = () => ({
  confirmationRequired: CREATE_PILOT_CONFIRMATION,
  confirmationPresent: true,
  approvedArtworkCountRequired: APPROVED_ARTWORK_COUNT,
  maxProductsToCreate: APPROVED_ARTWORK_COUNT * 2,
  draftOnly: true,
  publicationWritesAllowed: false,
  shopifyMutationsAllowed: true,
  shopifyMutation: "productSet(status: DRAFT)",
  mongoWritesAllowed: false,
  cloudinaryWritesAllowed: false,
  tokensPersisted: false,
});

const createReportProductEntry = (selectedProduct) => ({
  artworkId: selectedProduct.artworkId,
  artworkTitle: selectedProduct.title,
  productFamily: selectedProduct.productFamily,
  proposedHandle: selectedProduct.proposedHandle,
  productType: selectedProduct.productType,
  tags: selectedProduct.tags,
  status: selectedProduct.status,
  price: selectedProduct.price,
  inventoryQuantity: selectedProduct.inventoryQuantity,
  inventoryPolicy: "DENY",
  inventoryLocationId: selectedProduct.inventoryLocationId,
  inventoryLocationName: selectedProduct.inventoryLocationName,
  imageSource: selectedProduct.imageUrl,
  metafield: {
    namespace: "custom",
    key: "mongodb_artwork_id",
    value: selectedProduct.artworkId,
  },
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

const summarizeProducts = (products) => ({
  approvedArtworks: APPROVED_ARTWORK_COUNT,
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

function createProductSetVariables(selectedProduct) {
  const definition = PRODUCT_FAMILY_DEFINITIONS[selectedProduct.productFamily];
  const productTitle = `${selectedProduct.title}, ${definition.titleSuffix}`;
  const fileInput = {
    originalSource: selectedProduct.imageUrl,
    alt: productTitle,
    contentType: "IMAGE",
  };

  return {
    synchronous: true,
    productSet: {
      title: productTitle,
      handle: selectedProduct.proposedHandle,
      status: "DRAFT",
      productType: selectedProduct.productType,
      tags: selectedProduct.tags,
      metafields: [
        {
          namespace: "custom",
          key: "mongodb_artwork_id",
          value: selectedProduct.artworkId,
          type: "single_line_text_field",
        },
      ],
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

const buildPilotCreateReport = ({
  plan,
  reconciliation,
  approval,
  source,
  generatedAt,
}) => {
  const { selectedArtworks, selectedProducts } = buildSelectedProducts({
    plan,
    reconciliation,
    approval,
  });
  const products = selectedProducts.map(createReportProductEntry);

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode: "shopify_catalog_pilot_creation",
    source,
    safety: createSafetySummary(),
    selectedArtworks,
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
          "Pilot creation stopped after an earlier product failed or returned user errors.",
      };
    }
  });
  report.summary = summarizeProducts(report.products);
};

const hasPilotCreateFailures = (report) =>
  report.summary.productsFailed > 0 || report.summary.productsSkipped > 0;

module.exports = {
  APPROVED_ARTWORK_COUNT,
  CREATE_PILOT_CONFIRMATION,
  DEFAULT_APPROVAL_INPUT_PATH,
  DEFAULT_PILOT_OUTPUT_PATH,
  DEFAULT_PLAN_INPUT_PATH,
  DEFAULT_PRINT_QUANTITY,
  DEFAULT_RECONCILIATION_INPUT_PATH,
  ORIGINAL_QUANTITY,
  PRODUCT_SET_MUTATION,
  applyProductSetFailure,
  applyProductSetSuccess,
  buildPilotCreateReport,
  buildSelectedProducts,
  createAdminGraphqlUrl,
  createProductSetVariables,
  hasPilotCreateFailures,
  markRemainingProductsSkipped,
  parseArgs,
  redactSensitiveText,
  validateApprovalInput,
  validateExecutionOptions,
  validateRequiredEnv,
};
