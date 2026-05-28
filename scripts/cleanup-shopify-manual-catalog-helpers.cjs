const {
  createAdminGraphqlUrl,
  inferProductFamily,
  redactSensitiveText,
  validateRequiredEnv,
} = require("./reconcile-shopify-catalog-plan-helpers.cjs");

const DEFAULT_RECONCILIATION_INPUT_PATH =
  "reports/shopify-catalog-reconciliation-report.json";
const DEFAULT_CLEANUP_OUTPUT_PATH =
  "reports/shopify-manual-product-cleanup-report.json";
const ARCHIVE_CONFIRMATION = "ARCHIVE_MANUAL_ORIGINAL_PRINT_PRODUCTS";
const SHOPIFY_PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/(\d+)$/;

const PRODUCT_ARCHIVE_MUTATION = `
  mutation ArchiveManualCatalogProduct($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product {
        id
        legacyResourceId
        handle
        title
        status
      }
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
    if (arg.startsWith("--reconciliation=")) {
      options.reconciliation = arg.slice("--reconciliation=".length);
      return;
    }

    if (arg.startsWith("--input=")) {
      options.reconciliation = arg.slice("--input=".length);
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

  if (!["dry-run", "archive"].includes(options.mode)) {
    if (options.mode === "delete") {
      throw new Error(
        "Delete mode is intentionally not implemented for T-331. Use archive mode first."
      );
    }

    throw new Error(`Unsupported cleanup mode: ${options.mode}`);
  }

  return options;
};

const validateExecutionOptions = (options) => {
  if (options.mode === "archive" && options.confirm !== ARCHIVE_CONFIRMATION) {
    throw new Error(
      `Archive mode requires --confirm=${ARCHIVE_CONFIRMATION}.`
    );
  }

  return options;
};

const getProductKey = (product) =>
  product?.id || product?.legacyResourceId || product?.handle || null;

const getLegacyResourceId = (product) => {
  if (product?.legacyResourceId !== undefined && product.legacyResourceId !== null) {
    return String(product.legacyResourceId);
  }

  const gidMatch =
    typeof product?.id === "string" ? product.id.match(SHOPIFY_PRODUCT_GID_PATTERN) : null;

  return gidMatch?.[1] ?? null;
};

const normalizeProductSummary = (product) => {
  if (!product || typeof product !== "object") {
    return null;
  }

  return {
    id: typeof product.id === "string" ? product.id : null,
    legacyResourceId: getLegacyResourceId(product),
    handle: typeof product.handle === "string" ? product.handle : null,
    title: typeof product.title === "string" ? product.title : null,
    productType:
      typeof product.productType === "string" ? product.productType : "",
    status: typeof product.status === "string" ? product.status : null,
    tags: Array.isArray(product.tags)
      ? product.tags.filter((tag) => typeof tag === "string")
      : [],
    customMongodbArtworkId:
      typeof product.customMongodbArtworkId === "string"
        ? product.customMongodbArtworkId
        : null,
    totalInventory:
      typeof product.totalInventory === "number" ? product.totalInventory : null,
    adminUrl: typeof product.adminUrl === "string" ? product.adminUrl : null,
  };
};

const createSafetySummary = ({ mode }) => ({
  dryRun: mode === "dry-run",
  shopifyMutationsAllowed: mode === "archive",
  shopifyMutation: mode === "archive" ? "productUpdate(status: ARCHIVED)" : null,
  deleteProductsAllowed: false,
  productDiscoveryAllowed: false,
  mongoWritesAllowed: false,
  cloudinaryWritesAllowed: false,
  bookProductsAllowed: false,
  tokensPersisted: false,
});

const validateReconciliationReport = (report) => {
  if (!report || typeof report !== "object" || !Array.isArray(report.artworks)) {
    throw new Error("Invalid reconciliation report: expected an artworks array.");
  }

  if (report.mode !== "read_only_shopify_reconciliation") {
    throw new Error(
      "Invalid reconciliation report: expected read_only_shopify_reconciliation mode."
    );
  }

  if (report.safety?.readOnly !== true) {
    throw new Error("Invalid reconciliation report: expected read-only safety.");
  }

  if (Array.isArray(report.queryErrors) && report.queryErrors.length > 0) {
    throw new Error(
      "Refusing cleanup from a reconciliation report with Shopify query errors."
    );
  }

  return report;
};

const mergeCandidate = (candidatesByKey, product, evidence) => {
  const normalizedProduct = normalizeProductSummary(product);
  const key = getProductKey(normalizedProduct);

  if (!key) {
    return;
  }

  if (!candidatesByKey.has(key)) {
    candidatesByKey.set(key, {
      product: normalizedProduct,
      evidence: [],
    });
  }

  const candidate = candidatesByKey.get(key);

  candidate.product = {
    ...candidate.product,
    ...Object.fromEntries(
      Object.entries(normalizedProduct).filter(([, value]) => value !== null)
    ),
  };
  candidate.evidence.push(evidence);
};

const findProductByConflict = ({ conflict, productResult, artwork }) => {
  const conflictKey = conflict?.shopifyProductId || conflict?.shopifyProductHandle;
  const products = [
    ...(productResult?.manualNumberMatches ?? []),
    ...(artwork?.matchesByManualArtworkNumber ?? []),
  ];

  return products.find(
    (product) =>
      product?.id === conflictKey ||
      product?.legacyResourceId === conflictKey ||
      product?.handle === conflictKey
  );
};

const collectManualCleanupCandidates = (report) => {
  const validReport = validateReconciliationReport(report);
  const candidatesByKey = new Map();

  validReport.artworks.forEach((artwork) => {
    (artwork.products ?? []).forEach((productResult) => {
      (productResult.manualNumberMatches ?? []).forEach((product) => {
        mergeCandidate(candidatesByKey, product, {
          source: "manualNumberMatches",
          artworkId: artwork.customMongodbArtworkId ?? artwork.artworkId ?? null,
          artworkNumber: artwork.artworkNumber ?? null,
          plannedProductFamily: productResult.productFamily ?? null,
          matchStatus: productResult.matchStatus ?? null,
          proposedHandle: productResult.proposedHandle ?? null,
        });
      });

      (productResult.conflicts ?? []).forEach((conflict) => {
        if (!conflict?.shopifyProductId && !conflict?.shopifyProductHandle) {
          return;
        }

        const conflictProduct = findProductByConflict({
          conflict,
          productResult,
          artwork,
        });

        mergeCandidate(candidatesByKey, conflictProduct ?? {
          id: conflict.shopifyProductId ?? null,
          handle: conflict.shopifyProductHandle ?? null,
        }, {
          source: "conflict",
          conflictCode: conflict.code ?? null,
          artworkId: artwork.customMongodbArtworkId ?? artwork.artworkId ?? null,
          artworkNumber: artwork.artworkNumber ?? null,
          plannedProductFamily: productResult.productFamily ?? null,
          matchStatus: productResult.matchStatus ?? null,
          proposedHandle: productResult.proposedHandle ?? null,
        });
      });
    });
  });

  return Array.from(candidatesByKey.values());
};

const isBookLikeProduct = (product) => {
  const text = [
    product?.handle,
    product?.title,
    product?.productType,
    ...(Array.isArray(product?.tags) ? product.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /\b(book|catalog|catalogue|publication)\b/.test(text);
};

const validateCandidateProduct = (candidate) => {
  const errors = [];
  const product = candidate.product;
  const family = inferProductFamily(product);

  if (!product.id || !SHOPIFY_PRODUCT_GID_PATTERN.test(product.id)) {
    errors.push({
      code: "invalid_shopify_product_id",
      message: "Candidate lacks a valid Shopify Product GID.",
    });
  }

  if (!product.handle) {
    errors.push({
      code: "missing_handle",
      message: "Candidate lacks a Shopify handle.",
    });
  }

  if (!product.status) {
    errors.push({
      code: "missing_status",
      message: "Candidate lacks previous Shopify status.",
    });
  }

  if (isBookLikeProduct(product)) {
    errors.push({
      code: "book_product_rejected",
      message: "Candidate looks like a book/catalog/publication product.",
    });
  }

  if (!["original", "print"].includes(family)) {
    errors.push({
      code: "missing_original_print_family_evidence",
      message: "Candidate lacks original/print family evidence.",
    });
  }

  const evidenceSources = new Set(
    candidate.evidence.map((entry) => entry.source).filter(Boolean)
  );

  if (
    !evidenceSources.has("manualNumberMatches") &&
    !evidenceSources.has("conflict")
  ) {
    errors.push({
      code: "not_allowlisted_by_reconciliation",
      message:
        "Candidate is not present in reconciliation manualNumberMatches or conflict rows.",
    });
  }

  return {
    family,
    errors,
  };
};

const createProductReportEntry = ({ candidate, mode }) => {
  const { product, evidence } = candidate;
  const validation = validateCandidateProduct(candidate);
  const evidenceSources = Array.from(
    new Set(evidence.map((entry) => entry.source).filter(Boolean))
  );
  const plannedProductFamilies = Array.from(
    new Set(evidence.map((entry) => entry.plannedProductFamily).filter(Boolean))
  );
  const baseEntry = {
    shopifyProductId: product.id,
    legacyResourceId: product.legacyResourceId,
    handle: product.handle,
    title: product.title,
    productType: product.productType,
    tags: product.tags,
    previousStatus: product.status,
    inferredFamily: validation.family,
    evidenceSources,
    plannedProductFamilies,
    evidence,
    action: null,
    shopifyResponse: null,
    error: null,
  };

  if (validation.errors.length > 0) {
    return {
      ...baseEntry,
      action: "rejected",
      error: {
        code: "candidate_validation_failed",
        validationErrors: validation.errors,
      },
    };
  }

  if (product.status === "ARCHIVED") {
    return {
      ...baseEntry,
      action: "skipped_already_archived",
    };
  }

  return {
    ...baseEntry,
    action: mode === "archive" ? "archive_product" : "would_archive_product",
  };
};

const summarizeProductEntries = (products) => ({
  candidatesFound: products.length,
  productsTargeted: products.filter((product) =>
    ["archive_product", "would_archive_product"].includes(product.action)
  ).length,
  productsRejected: products.filter((product) => product.action === "rejected")
    .length,
  productsAlreadyArchived: products.filter(
    (product) => product.action === "skipped_already_archived"
  ).length,
  archiveAttempts: products.filter((product) => product.action === "archive_product")
    .length,
  archiveSucceeded: products.filter((product) => product.action === "archived")
    .length,
  archiveFailed: products.filter((product) => product.action === "archive_failed")
    .length,
});

const buildCleanupReport = ({
  reconciliationReport,
  reconciliationInputPath,
  outputPath,
  mode,
  generatedAt,
}) => {
  const candidates = collectManualCleanupCandidates(reconciliationReport);
  const products = candidates
    .map((candidate) => createProductReportEntry({ candidate, mode }))
    .sort((first, second) =>
      String(first.legacyResourceId ?? first.shopifyProductId).localeCompare(
        String(second.legacyResourceId ?? second.shopifyProductId)
      )
    );

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode: "shopify_manual_original_print_cleanup",
    requestedMode: mode,
    source: {
      reconciliationInputPath,
      cleanupOutputPath: outputPath,
      shopDomain: reconciliationReport.source?.shopDomain ?? null,
      adminApiVersion: reconciliationReport.source?.adminApiVersion ?? null,
      reconciliationGeneratedAt: reconciliationReport.generatedAt ?? null,
    },
    safety: createSafetySummary({ mode }),
    summary: summarizeProductEntries(products),
    products,
  };
};

const hasBlockingCleanupValidation = (report) =>
  report.summary.productsRejected > 0;

const hasCleanupExecutionFailures = (report) =>
  report.summary.archiveFailed > 0;

const createArchiveMutationVariables = (shopifyProductId) => ({
  product: {
    id: shopifyProductId,
    status: "ARCHIVED",
  },
});

module.exports = {
  ARCHIVE_CONFIRMATION,
  DEFAULT_CLEANUP_OUTPUT_PATH,
  DEFAULT_RECONCILIATION_INPUT_PATH,
  PRODUCT_ARCHIVE_MUTATION,
  buildCleanupReport,
  collectManualCleanupCandidates,
  createAdminGraphqlUrl,
  createArchiveMutationVariables,
  hasBlockingCleanupValidation,
  hasCleanupExecutionFailures,
  parseArgs,
  redactSensitiveText,
  summarizeProductEntries,
  validateExecutionOptions,
  validateRequiredEnv,
};
