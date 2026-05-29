const DEFAULT_OUTPUT_PATH =
  "reports/shopify-product-link-public-listing-plan.json";
const SET_PUBLIC_LISTING_CONFIRMATION =
  "SET_SHOPIFY_PRODUCT_LINK_PUBLIC_LISTING";
const VALID_LINK_TYPES = new Set(["original", "print", "book"]);

const parseArgs = (argv) => {
  const options = {};

  argv.forEach((arg) => {
    if (arg.startsWith("--type=")) {
      options.type = arg.slice("--type=".length);
      return;
    }

    if (arg.startsWith("--public-listing=")) {
      options.publicListing = arg.slice("--public-listing=".length);
      return;
    }

    if (arg.startsWith("--mode=")) {
      options.mode = arg.slice("--mode=".length);
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

const parseBooleanOption = (value, fieldName) => {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (["true", "yes", "1"].includes(normalized)) {
    return true;
  }

  if (["false", "no", "0"].includes(normalized)) {
    return false;
  }

  throw new Error(`${fieldName} must be true or false.`);
};

const validateExecutionOptions = (options) => {
  const mode = options.mode ?? "plan";

  if (!["plan", "write"].includes(mode)) {
    throw new Error("Mode must be plan or write.");
  }

  if (!VALID_LINK_TYPES.has(options.type)) {
    throw new Error("Type must be original, print, or book.");
  }

  const publicListing = parseBooleanOption(
    options.publicListing,
    "public-listing"
  );

  if (mode === "write" && options.confirm !== SET_PUBLIC_LISTING_CONFIRMATION) {
    throw new Error(
      `Public-listing writes require --confirm=${SET_PUBLIC_LISTING_CONFIRMATION}.`
    );
  }

  if (mode === "plan" && options.confirm) {
    throw new Error("Plan mode does not accept a confirmation flag.");
  }

  return {
    ...options,
    mode,
    publicListing,
  };
};

const validateMongoEnv = (env) => {
  const mongoUri = String(env.MONGO_URI ?? "").trim();

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI.");
  }

  return { mongoUri };
};

const normalizeLink = (link) => ({
  productId: String(link?.productId ?? "").trim(),
  type: String(link?.type ?? "").trim(),
  publicListing: link?.publicListing === false ? false : true,
});

const buildPublicListingPlan = ({
  artworks,
  type,
  publicListing,
  source,
  mode = "plan",
  confirmation,
  generatedAt,
}) => {
  const plannedArtworks = artworks.flatMap((artwork) => {
    const existingLinks = Array.isArray(artwork.shopifyProducts)
      ? artwork.shopifyProducts.map(normalizeLink)
      : [];
    const targetIndexes = existingLinks.flatMap((link, index) =>
      link.type === type ? [index] : []
    );

    if (targetIndexes.length === 0) {
      return [];
    }

    const desiredLinks = existingLinks.map((link, index) =>
      targetIndexes.includes(index) ? { ...link, publicListing } : link
    );
    const changedIndexes = targetIndexes.filter(
      (index) => existingLinks[index].publicListing !== publicListing
    );

    return [
      {
        artworkId: String(artwork._id),
        title: artwork.title ?? null,
        targetType: type,
        targetPublicListing: publicListing,
        targetLinkCount: targetIndexes.length,
        changedLinkCount: changedIndexes.length,
        changedLinkIndexes: changedIndexes,
        existingShopifyProducts: existingLinks,
        desiredShopifyProducts: desiredLinks,
        action:
          changedIndexes.length > 0
            ? "set_public_listing"
            : "already_matches",
        writeResult: null,
        error: null,
      },
    ];
  });

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode:
      mode === "write"
        ? "shopify_product_link_public_listing_write"
        : "shopify_product_link_public_listing_plan",
    source,
    safety: {
      mode,
      confirmationRequired:
        mode === "write" ? SET_PUBLIC_LISTING_CONFIRMATION : null,
      confirmationPresent:
        mode === "write" && confirmation === SET_PUBLIC_LISTING_CONFIRMATION,
      targetType: type,
      targetPublicListing: publicListing,
      mongoWritesAllowed: mode === "write",
      shopifyMutationsAllowed: false,
      cloudinaryWritesAllowed: false,
      tokensPersisted: false,
    },
    summary: summarizePlan(plannedArtworks),
    artworks: plannedArtworks,
    noMutationStatement:
      mode === "write"
        ? "This report records MongoDB shopifyProducts publicListing writes only. It does not mutate Shopify or Cloudinary."
        : "Plan mode is read-only and does not mutate MongoDB, Shopify, or Cloudinary.",
  };
};

const summarizePlan = (artworks) => ({
  artworksScannedWithTargetLinks: artworks.length,
  artworksAlreadyMatching: artworks.filter(
    (artwork) => artwork.action === "already_matches"
  ).length,
  artworksToUpdate: artworks.filter(
    (artwork) => artwork.action === "set_public_listing"
  ).length,
  artworksUpdated: artworks.filter((artwork) => artwork.action === "updated")
    .length,
  artworksFailed: artworks.filter((artwork) => artwork.action === "update_failed")
    .length,
  targetLinksScanned: artworks.reduce(
    (total, artwork) => total + artwork.targetLinkCount,
    0
  ),
  targetLinksToChange: artworks.reduce(
    (total, artwork) => total + artwork.changedLinkCount,
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
  report.summary = summarizePlan(report.artworks);
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
  report.summary = summarizePlan(report.artworks);
};

const hasMongoWriteFailures = (report) => report.summary.artworksFailed > 0;

module.exports = {
  DEFAULT_OUTPUT_PATH,
  SET_PUBLIC_LISTING_CONFIRMATION,
  applyMongoWriteFailure,
  applyMongoWriteSuccess,
  buildPublicListingPlan,
  hasMongoWriteFailures,
  parseArgs,
  validateExecutionOptions,
  validateMongoEnv,
};
