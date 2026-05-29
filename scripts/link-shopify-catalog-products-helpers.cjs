const DEFAULT_RECONCILIATION_INPUT_PATH =
  "reports/shopify-catalog-post-draft-create-reconciliation-report.json";
const DEFAULT_LINK_PLAN_OUTPUT_PATH =
  "reports/shopify-catalog-mongodb-link-plan.json";
const DEFAULT_LINK_WRITE_OUTPUT_PATH =
  "reports/shopify-catalog-mongodb-link-write-report.json";
const LINK_PRODUCTS_CONFIRMATION = "LINK_GENERATED_SHOPIFY_PRODUCTS";
const SHOPIFY_PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/(\d+)$/;
const MONGODB_OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

const PRODUCT_FAMILY_TO_LINK_TYPE = {
  original: "original",
  print: "print",
};

const createSafetySummary = ({ mode, confirmation }) => ({
  mode,
  confirmationRequired:
    mode === "write" ? LINK_PRODUCTS_CONFIRMATION : null,
  confirmationPresent: mode === "write" && confirmation === LINK_PRODUCTS_CONFIRMATION,
  shopifyMutationsAllowed: false,
  mongoWritesAllowed: mode === "write",
  mongoWrite: mode === "write" ? "artworks.updateOne($set.shopifyProducts)" : null,
  cloudinaryWritesAllowed: false,
  publicationWritesAllowed: false,
  tokensPersisted: false,
});

const parseArgs = (argv) => {
  const options = {};

  argv.forEach((arg) => {
    if (arg.startsWith("--reconciliation=")) {
      options.reconciliation = arg.slice("--reconciliation=".length);
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

  return options;
};

const validateExecutionOptions = (options) => {
  const mode = options.mode ?? "plan";

  if (!["plan", "write"].includes(mode)) {
    throw new Error("Mode must be plan or write.");
  }

  if (mode === "write" && options.confirm !== LINK_PRODUCTS_CONFIRMATION) {
    throw new Error(
      `MongoDB link writes require --confirm=${LINK_PRODUCTS_CONFIRMATION}.`
    );
  }

  if (mode === "plan" && options.confirm) {
    throw new Error("Plan mode does not accept a confirmation flag.");
  }

  return {
    ...options,
    mode,
  };
};

const validateMongoEnv = (env) => {
  const mongoUri = String(env.MONGO_URI ?? "").trim();

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI.");
  }

  return { mongoUri };
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

  if ((summary.plannedProductsWithNoMatch ?? 0) > 0) {
    throw new Error("Reconciliation report still has no-match rows.");
  }

  return reconciliation;
};

const normalizeProductId = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const raw = String(value).trim();

  if (/^\d+$/.test(raw)) {
    return raw;
  }

  return raw.match(SHOPIFY_PRODUCT_GID_PATTERN)?.[1] ?? null;
};

const getExactProduct = ({ artworkId, family, productRow }) => {
  if (!productRow) {
    throw new Error(`Artwork ${artworkId} lacks a ${family} reconciliation row.`);
  }

  if (
    productRow.productFamily !== family ||
    productRow.matchStatus !== "exact_match" ||
    productRow.recommendedAction !== "preserve_existing_product"
  ) {
    throw new Error(`Artwork ${artworkId} ${family} is not an exact match.`);
  }

  if ((productRow.conflicts ?? []).length > 0) {
    throw new Error(`Artwork ${artworkId} ${family} has conflicts.`);
  }

  const product = productRow.handleMatch;
  const productId = normalizeProductId(product?.legacyResourceId ?? product?.id);

  if (!productId) {
    throw new Error(`Artwork ${artworkId} ${family} lacks a numeric product ID.`);
  }

  if (product?.customMongodbArtworkId !== artworkId) {
    throw new Error(
      `Artwork ${artworkId} ${family} exact match has the wrong MongoDB artwork metafield.`
    );
  }

  return {
    productId,
    gid: product?.id ?? `gid://shopify/Product/${productId}`,
    handle: product?.handle ?? productRow.proposedHandle,
    title: product?.title ?? null,
    status: product?.status ?? null,
    productType: product?.productType ?? null,
    adminUrl: product?.adminUrl ?? null,
  };
};

const getGeneratedLinkRows = (reconciliationArtwork) => {
  const artworkId = String(
    reconciliationArtwork?.customMongodbArtworkId ??
      reconciliationArtwork?.artworkId ??
      ""
  ).trim();

  if (!MONGODB_OBJECT_ID_PATTERN.test(artworkId)) {
    throw new Error("Reconciliation report contains an invalid artwork ID.");
  }

  const links = Object.entries(PRODUCT_FAMILY_TO_LINK_TYPE).map(
    ([family, type]) => {
      const productRow = (reconciliationArtwork.products ?? []).find(
        (candidate) => candidate?.productFamily === family
      );
      const exactProduct = getExactProduct({
        artworkId,
        family,
        productRow,
      });

      return {
        type,
        productId: exactProduct.productId,
        publicListing: false,
        source: {
          productFamily: family,
          gid: exactProduct.gid,
          handle: exactProduct.handle,
          title: exactProduct.title,
          status: exactProduct.status,
          productType: exactProduct.productType,
          adminUrl: exactProduct.adminUrl,
        },
      };
    }
  );

  return {
    artworkId,
    title: reconciliationArtwork.title ?? null,
    generatedLinks: links,
  };
};

const normalizeExistingLink = (link) => {
  const productId = normalizeProductId(link?.productId);
  const type = typeof link?.type === "string" ? link.type : null;

  if (!productId || !["original", "print", "book"].includes(type)) {
    return null;
  }

  return {
    productId,
    type,
    publicListing: link.publicListing === false ? false : true,
  };
};

const mergeDesiredLinks = ({ existingLinks, generatedLinks }) => {
  const preservedLinks = (existingLinks ?? [])
    .map(normalizeExistingLink)
    .filter((link) => link && link.type === "book");
  const desiredLinks = [
    ...generatedLinks.map((link) => ({
      productId: link.productId,
      type: link.type,
      publicListing: false,
    })),
    ...preservedLinks,
  ];
  const seen = new Set();

  desiredLinks.forEach((link) => {
    if (seen.has(link.productId)) {
      throw new Error(
        `Desired Shopify links contain duplicate product ID ${link.productId}.`
      );
    }

    seen.add(link.productId);
  });

  return desiredLinks;
};

const linksEqual = (left, right) =>
  JSON.stringify(left ?? []) === JSON.stringify(right ?? []);

const buildMongoLinkPlan = ({
  reconciliation,
  artworks,
  source,
  mode = "plan",
  confirmation,
  generatedAt,
}) => {
  const validReconciliation = validateReconciliationInput(reconciliation);
  const artworksById = new Map(
    artworks.map((artwork) => [String(artwork._id), artwork])
  );
  const plannedArtworks = validReconciliation.artworks.map((reportArtwork) => {
    const generated = getGeneratedLinkRows(reportArtwork);
    const mongoArtwork = artworksById.get(generated.artworkId);

    if (!mongoArtwork) {
      throw new Error(`Artwork ${generated.artworkId} was not found in MongoDB.`);
    }

    const existingShopifyProducts = (mongoArtwork.shopifyProducts ?? [])
      .map(normalizeExistingLink)
      .filter(Boolean);
    const desiredShopifyProducts = mergeDesiredLinks({
      existingLinks: existingShopifyProducts,
      generatedLinks: generated.generatedLinks,
    });
    const currentOriginalPrintLinks = existingShopifyProducts.filter((link) =>
      ["original", "print"].includes(link.type)
    );

    return {
      artworkId: generated.artworkId,
      title: mongoArtwork.title ?? generated.title,
      existingShopifyProducts,
      generatedShopifyProducts: generated.generatedLinks,
      desiredShopifyProducts,
      preservedBookLinks: desiredShopifyProducts.filter(
        (link) => link.type === "book"
      ),
      replacedOriginalPrintLinks: currentOriginalPrintLinks,
      action: linksEqual(existingShopifyProducts, desiredShopifyProducts)
        ? "already_linked"
        : "set_shopify_products",
      writeResult: null,
      error: null,
    };
  });

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode:
      mode === "write"
        ? "mongodb_shopify_catalog_link_write"
        : "mongodb_shopify_catalog_link_plan",
    source,
    safety: createSafetySummary({ mode, confirmation }),
    summary: summarizeLinkPlan(plannedArtworks),
    artworks: plannedArtworks,
    noMutationStatement:
      mode === "write"
        ? "This report records MongoDB artwork link writes only. It does not mutate Shopify or Cloudinary."
        : "Plan mode is read-only and does not mutate MongoDB, Shopify, or Cloudinary.",
  };
};

const summarizeLinkPlan = (artworks) => ({
  artworksScanned: artworks.length,
  artworksAlreadyLinked: artworks.filter(
    (artwork) => artwork.action === "already_linked"
  ).length,
  artworksToUpdate: artworks.filter(
    (artwork) => artwork.action === "set_shopify_products"
  ).length,
  artworksUpdated: artworks.filter((artwork) => artwork.action === "updated")
    .length,
  artworksFailed: artworks.filter((artwork) => artwork.action === "update_failed")
    .length,
  generatedLinksPlanned: artworks.reduce(
    (total, artwork) => total + artwork.generatedShopifyProducts.length,
    0
  ),
  publicGeneratedLinksPlanned: artworks.reduce(
    (total, artwork) =>
      total +
      artwork.generatedShopifyProducts.filter(
        (link) => link.publicListing !== false
      ).length,
    0
  ),
  preservedBookLinks: artworks.reduce(
    (total, artwork) => total + artwork.preservedBookLinks.length,
    0
  ),
  replacedOriginalPrintLinks: artworks.reduce(
    (total, artwork) => total + artwork.replacedOriginalPrintLinks.length,
    0
  ),
});

const applyMongoWriteSuccess = ({ report, artworkId, result }) => {
  const artwork = report.artworks.find((entry) => entry.artworkId === artworkId);

  if (!artwork) {
    return;
  }

  artwork.action = "updated";
  artwork.writeResult = {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    acknowledged: result.acknowledged,
  };
  report.summary = summarizeLinkPlan(report.artworks);
};

const applyMongoWriteFailure = ({ report, artworkId, error }) => {
  const artwork = report.artworks.find((entry) => entry.artworkId === artworkId);

  if (!artwork) {
    return;
  }

  artwork.action = "update_failed";
  artwork.error = {
    code: "mongodb_update_failed",
    message: error instanceof Error ? error.message : String(error),
  };
  report.summary = summarizeLinkPlan(report.artworks);
};

const hasMongoWriteFailures = (report) => report.summary.artworksFailed > 0;

module.exports = {
  DEFAULT_LINK_PLAN_OUTPUT_PATH,
  DEFAULT_LINK_WRITE_OUTPUT_PATH,
  DEFAULT_RECONCILIATION_INPUT_PATH,
  LINK_PRODUCTS_CONFIRMATION,
  applyMongoWriteFailure,
  applyMongoWriteSuccess,
  buildMongoLinkPlan,
  hasMongoWriteFailures,
  mergeDesiredLinks,
  normalizeProductId,
  parseArgs,
  validateExecutionOptions,
  validateMongoEnv,
  validateReconciliationInput,
};
