const {
  createAdminGraphqlUrl,
  inferProductFamily,
  redactSensitiveText,
  validateRequiredEnv,
} = require("./reconcile-shopify-catalog-plan-helpers.cjs");

const DEFAULT_CLEAN_SLATE_OUTPUT_PATH =
  "reports/shopify-clean-slate-catalog-cleanup-report.json";
const DELETE_CONFIRMATION = "DELETE_ALL_NON_BOOK_SHOPIFY_PRODUCTS";
const SHOPIFY_PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/(\d+)$/;
const BOOK_MARKER_PATTERN =
  /\b(book|books|catalog|catalogs|catalogue|catalogues|publication|publications|monograph|monographs)\b/i;

const SHOPIFY_PRODUCTS_QUERY = `
  query CleanSlateCatalogProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          legacyResourceId
          handle
          title
          productType
          status
          tags
          totalInventory
          vendor
          createdAt
          updatedAt
          metafield(namespace: "custom", key: "mongodb_artwork_id") {
            namespace
            key
            value
            type
          }
          featuredArtworkIds: metafield(namespace: "custom", key: "featured_artwork_ids") {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

const PRODUCT_DELETE_MUTATION = `
  mutation DeleteCleanSlateCatalogProduct($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }
`;

const parseArgs = (argv) => {
  const options = {
    mode: "dry-run",
  };

  argv.forEach((arg) => {
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

  if (!["dry-run", "delete"].includes(options.mode)) {
    throw new Error(`Unsupported clean-slate cleanup mode: ${options.mode}`);
  }

  return options;
};

const validateExecutionOptions = (options) => {
  if (options.mode === "delete" && options.confirm !== DELETE_CONFIRMATION) {
    throw new Error(`Delete mode requires --confirm=${DELETE_CONFIRMATION}.`);
  }

  return options;
};

const getLegacyResourceId = (product) => {
  if (product?.legacyResourceId !== undefined && product.legacyResourceId !== null) {
    return String(product.legacyResourceId);
  }

  const gidMatch =
    typeof product?.id === "string" ? product.id.match(SHOPIFY_PRODUCT_GID_PATTERN) : null;

  return gidMatch?.[1] ?? null;
};

const getCustomMongodbArtworkId = (product) => {
  if (typeof product?.customMongodbArtworkId === "string") {
    return product.customMongodbArtworkId.trim() || null;
  }

  const metafield = product?.metafield;

  if (!metafield) {
    return null;
  }

  return typeof metafield.value === "string" ? metafield.value.trim() || null : null;
};

const parseFeaturedArtworkIds = (metafield) => {
  if (!metafield || typeof metafield.value !== "string") {
    return [];
  }

  const value = metafield.value.trim();

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
          .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
          .filter(Boolean)
      : [];
  } catch {
    return [value];
  }
};

const normalizeShopifyProduct = (product, { shopDomain } = {}) => {
  const legacyResourceId = getLegacyResourceId(product);
  const featuredArtworkIds = parseFeaturedArtworkIds(product?.featuredArtworkIds);
  const summary = {
    id: typeof product?.id === "string" ? product.id : null,
    legacyResourceId,
    handle: typeof product?.handle === "string" ? product.handle : null,
    title: typeof product?.title === "string" ? product.title : null,
    productType:
      typeof product?.productType === "string" ? product.productType : "",
    status: typeof product?.status === "string" ? product.status : null,
    tags: Array.isArray(product?.tags)
      ? product.tags.filter((tag) => typeof tag === "string")
      : [],
    totalInventory:
      typeof product?.totalInventory === "number" ? product.totalInventory : null,
    vendor: typeof product?.vendor === "string" ? product.vendor : null,
    createdAt: typeof product?.createdAt === "string" ? product.createdAt : null,
    updatedAt: typeof product?.updatedAt === "string" ? product.updatedAt : null,
    customMongodbArtworkId: getCustomMongodbArtworkId(product),
    featuredArtworkIds,
  };

  if (legacyResourceId && shopDomain) {
    summary.adminUrl = `https://${shopDomain}/admin/products/${legacyResourceId}`;
  }

  return summary;
};

const getBookClassificationEvidence = (product) => {
  const evidence = [];
  const scalarFields = [
    ["handle", product?.handle],
    ["title", product?.title],
    ["productType", product?.productType],
  ];

  scalarFields.forEach(([field, value]) => {
    if (typeof value === "string" && BOOK_MARKER_PATTERN.test(value)) {
      evidence.push(`${field}_book_publication_marker`);
    }
  });

  (Array.isArray(product?.tags) ? product.tags : []).forEach((tag) => {
    if (BOOK_MARKER_PATTERN.test(tag)) {
      evidence.push("tag_book_publication_marker");
    }
  });

  if (Array.isArray(product?.featuredArtworkIds) && product.featuredArtworkIds.length > 0) {
    evidence.push("featured_artwork_ids_metafield_present");
  }

  return Array.from(new Set(evidence));
};

const classifyProductForCleanSlate = (product) => {
  const validationErrors = [];

  if (!product?.id || !SHOPIFY_PRODUCT_GID_PATTERN.test(product.id)) {
    validationErrors.push({
      code: "invalid_shopify_product_id",
      message: "Product lacks a valid Shopify Product GID.",
    });
  }

  if (!product?.handle) {
    validationErrors.push({
      code: "missing_handle",
      message: "Product lacks a Shopify handle.",
    });
  }

  if (validationErrors.length > 0) {
    return {
      classification: "rejected_invalid_product",
      inferredFamily: inferProductFamily(product),
      evidence: [],
      validationErrors,
    };
  }

  const bookEvidence = getBookClassificationEvidence(product);

  if (bookEvidence.length > 0) {
    return {
      classification: "keep_book_publication",
      inferredFamily: "book",
      evidence: bookEvidence,
      validationErrors: [],
    };
  }

  return {
    classification: "delete_candidate_non_book",
    inferredFamily: inferProductFamily(product) ?? "non_book",
    evidence: ["no_book_publication_marker"],
    validationErrors: [],
  };
};

const createSafetySummary = ({ mode }) => ({
  dryRun: mode === "dry-run",
  shopifyReadsAllowed: true,
  shopifyMutationsAllowed: mode === "delete",
  shopifyMutation: mode === "delete" ? "productDelete" : null,
  deleteProductsAllowed: mode === "delete",
  mongoReadsAllowed: false,
  mongoWritesAllowed: false,
  cloudinaryReadsAllowed: false,
  cloudinaryWritesAllowed: false,
  bookProductsDeleted: false,
  tokensPersisted: false,
});

const createProductReportEntry = ({ product, mode }) => {
  const classification = classifyProductForCleanSlate(product);
  const baseEntry = {
    shopifyProductId: product.id,
    legacyResourceId: product.legacyResourceId,
    handle: product.handle,
    title: product.title,
    productType: product.productType,
    tags: product.tags,
    status: product.status,
    totalInventory: product.totalInventory,
    vendor: product.vendor,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    adminUrl: product.adminUrl ?? null,
    customMongodbArtworkId: product.customMongodbArtworkId,
    featuredArtworkIds: product.featuredArtworkIds,
    classification: classification.classification,
    inferredFamily: classification.inferredFamily,
    classificationEvidence: classification.evidence,
    action: null,
    shopifyResponse: null,
    error: null,
  };

  if (classification.validationErrors.length > 0) {
    return {
      ...baseEntry,
      action: "rejected",
      error: {
        code: "product_validation_failed",
        validationErrors: classification.validationErrors,
      },
    };
  }

  if (classification.classification === "keep_book_publication") {
    return {
      ...baseEntry,
      action: "keep_book_publication",
    };
  }

  return {
    ...baseEntry,
    action: mode === "delete" ? "delete_product" : "would_delete_product",
  };
};

const summarizeProductEntries = (products) => ({
  productsScanned: products.length,
  bookPublicationProductsKept: products.filter(
    (product) => product.action === "keep_book_publication"
  ).length,
  nonBookDeleteCandidates: products.filter((product) =>
    ["would_delete_product", "delete_product", "deleted", "delete_failed"].includes(
      product.action
    )
  ).length,
  productsRejected: products.filter((product) => product.action === "rejected")
    .length,
  deleteAttempts: products.filter((product) => product.action === "delete_product")
    .length,
  deleteSucceeded: products.filter((product) => product.action === "deleted")
    .length,
  deleteFailed: products.filter((product) => product.action === "delete_failed")
    .length,
});

const buildCleanSlateReport = ({
  products,
  outputPath,
  mode,
  source,
  generatedAt,
}) => {
  const productEntries = products
    .map((product) => createProductReportEntry({ product, mode }))
    .sort((first, second) =>
      String(first.legacyResourceId ?? first.shopifyProductId).localeCompare(
        String(second.legacyResourceId ?? second.shopifyProductId)
      )
    );

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode: "shopify_clean_slate_catalog_cleanup",
    requestedMode: mode,
    source: {
      cleanupOutputPath: outputPath,
      shopDomain: source?.shopDomain ?? null,
      adminApiVersion: source?.adminApiVersion ?? null,
      productPagesRead: source?.productPagesRead ?? null,
    },
    safety: createSafetySummary({ mode }),
    summary: summarizeProductEntries(productEntries),
    products: productEntries,
  };
};

const hasBlockingCleanSlateValidation = (report) =>
  report.summary.productsRejected > 0;

const hasCleanSlateExecutionFailures = (report) =>
  report.summary.deleteFailed > 0;

const createDeleteMutationVariables = (shopifyProductId) => ({
  input: {
    id: shopifyProductId,
  },
});

module.exports = {
  DEFAULT_CLEAN_SLATE_OUTPUT_PATH,
  DELETE_CONFIRMATION,
  PRODUCT_DELETE_MUTATION,
  SHOPIFY_PRODUCTS_QUERY,
  buildCleanSlateReport,
  classifyProductForCleanSlate,
  createAdminGraphqlUrl,
  createDeleteMutationVariables,
  hasBlockingCleanSlateValidation,
  hasCleanSlateExecutionFailures,
  normalizeShopifyProduct,
  parseArgs,
  redactSensitiveText,
  summarizeProductEntries,
  validateExecutionOptions,
  validateRequiredEnv,
};
