const slugify = require("slugify");

const DEFAULT_PRINT_QUANTITY = 50;
const ORIGINAL_QUANTITY = 1;
const HANDLE_PREFIX = "joseph-laoutaris";

const PRODUCT_DEFINITIONS = {
  original: {
    productFamily: "original",
    productType: "Original Artwork",
    tags: ["original", "painting", "archive-artwork"],
    inventoryQuantity: ORIGINAL_QUANTITY,
  },
  print: {
    productFamily: "print",
    productType: "Fine Art Print",
    tags: ["print", "fine-art-print", "archive-artwork"],
  },
};

const toStringValue = (value) => {
  if (value && typeof value.toString === "function") {
    return value.toString();
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
};

const toArtworkId = (artwork) => toStringValue(artwork?._id).trim();

const toArtworkTitle = (artwork) =>
  typeof artwork?.title === "string" ? artwork.title.trim() : "";

const createArtworkSlug = (title) => {
  const slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  return slug || "untitled-artwork";
};

const createShortArtworkId = (artworkId) => {
  const normalized = artworkId.toLowerCase().replace(/[^a-z0-9]/g, "");

  return normalized.slice(-8) || "missingid";
};

const createProductHandle = ({ artworkId, productFamily, title }) => {
  return [
    HANDLE_PREFIX,
    productFamily,
    createArtworkSlug(title),
    createShortArtworkId(artworkId),
  ].join("-");
};

const hasImageUrl = (artwork) =>
  typeof artwork?.image?.secure_url === "string" &&
  artwork.image.secure_url.trim().length > 0;

const getImageUrl = (artwork) =>
  hasImageUrl(artwork) ? artwork.image.secure_url.trim() : null;

const parsePositiveInteger = (value, optionName) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${optionName} must be a positive integer.`);
  }

  return parsed;
};

const parsePrintQuantity = ({
  cliValue,
  envValue,
  defaultValue = DEFAULT_PRINT_QUANTITY,
} = {}) => {
  if (cliValue !== undefined) {
    return parsePositiveInteger(cliValue, "--print-quantity");
  }

  if (envValue !== undefined && envValue !== "") {
    return parsePositiveInteger(envValue, "SHOPIFY_PRINT_QUANTITY");
  }

  return defaultValue;
};

const createProductPlan = ({ artworkId, title, productFamily, printQuantity }) => {
  const definition = PRODUCT_DEFINITIONS[productFamily];
  const inventoryQuantity =
    productFamily === "print"
      ? printQuantity
      : definition.inventoryQuantity;

  return {
    productFamily: definition.productFamily,
    proposedHandle: createProductHandle({
      artworkId,
      productFamily,
      title,
    }),
    productType: definition.productType,
    tags: definition.tags,
    inventoryQuantity,
    inventoryPolicy: "deny",
    status: "draft_or_unpublished",
    metafields: [
      {
        namespace: "custom",
        key: "mongodb_artwork_id",
        value: artworkId || null,
      },
    ],
    warnings: [],
  };
};

const createArtworkPlan = (artwork, options) => {
  const artworkId = toArtworkId(artwork);
  const title = toArtworkTitle(artwork);
  const imageUrlPresent = hasImageUrl(artwork);
  const imageUrl = getImageUrl(artwork);
  const warnings = [];

  if (!artworkId) {
    warnings.push({
      code: "unsupported_required_data",
      message: "Artwork is missing a MongoDB _id.",
    });
  }

  if (!title) {
    warnings.push({
      code: "missing_title",
      message: "Artwork is missing a usable title.",
    });
  }

  if (!imageUrlPresent) {
    warnings.push({
      code: "missing_image",
      message: "Artwork is missing image.secure_url.",
    });
  }

  const originalProduct = createProductPlan({
    artworkId,
    title,
    productFamily: "original",
    printQuantity: options.printQuantity,
  });
  const printProduct = createProductPlan({
    artworkId,
    title,
    productFamily: "print",
    printQuantity: options.printQuantity,
  });

  return {
    artworkId: artworkId || null,
    title: title || null,
    imageUrlPresent,
    imageUrl,
    proposedOriginalHandle: originalProduct.proposedHandle,
    proposedPrintHandle: printProduct.proposedHandle,
    customMongodbArtworkId: artworkId || null,
    warnings,
    products: [originalProduct, printProduct],
  };
};

const addDuplicateHandleWarnings = (artworkPlans) => {
  const occurrencesByHandle = new Map();

  artworkPlans.forEach((artworkPlan, artworkIndex) => {
    artworkPlan.products.forEach((product, productIndex) => {
      const occurrences = occurrencesByHandle.get(product.proposedHandle) ?? [];
      occurrences.push({ artworkIndex, productIndex });
      occurrencesByHandle.set(product.proposedHandle, occurrences);
    });
  });

  for (const [handle, occurrences] of occurrencesByHandle.entries()) {
    if (occurrences.length <= 1) {
      continue;
    }

    occurrences.forEach(({ artworkIndex, productIndex }) => {
      const product = artworkPlans[artworkIndex].products[productIndex];
      const warning = {
        code: "duplicate_generated_handle",
        message: `Generated handle "${handle}" appears ${occurrences.length} times in this plan.`,
      };

      product.warnings.push(warning);
      artworkPlans[artworkIndex].warnings.push({
        ...warning,
        productFamily: product.productFamily,
      });
    });
  }
};

const summarizeArtworkPlans = (artworkPlans) => {
  const products = artworkPlans.flatMap((artworkPlan) => artworkPlan.products);

  return {
    totalArtworksScanned: artworkPlans.length,
    originalProductsPlanned: products.filter(
      (product) => product.productFamily === "original"
    ).length,
    printProductsPlanned: products.filter(
      (product) => product.productFamily === "print"
    ).length,
    artworksMissingTitle: artworkPlans.filter((artworkPlan) =>
      artworkPlan.warnings.some((warning) => warning.code === "missing_title")
    ).length,
    artworksMissingImage: artworkPlans.filter((artworkPlan) =>
      artworkPlan.warnings.some((warning) => warning.code === "missing_image")
    ).length,
    duplicateGeneratedHandleCount: products.filter((product) =>
      product.warnings.some(
        (warning) => warning.code === "duplicate_generated_handle"
      )
    ).length,
    unsupportedRequiredDataCount: artworkPlans.filter((artworkPlan) =>
      artworkPlan.warnings.some(
        (warning) => warning.code === "unsupported_required_data"
      )
    ).length,
  };
};

const buildShopifyCatalogPlan = (artworks, options = {}) => {
  const printQuantity = options.printQuantity ?? DEFAULT_PRINT_QUANTITY;
  const artworkPlans = artworks.map((artwork) =>
    createArtworkPlan(artwork, { printQuantity })
  );

  addDuplicateHandleWarnings(artworkPlans);

  return {
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    mode: "dry-run",
    source: "mongodb.artworks",
    safety: {
      callsShopify: false,
      mutatesShopify: false,
      mutatesMongoDB: false,
      mutatesCloudinary: false,
    },
    options: {
      originalQuantity: ORIGINAL_QUANTITY,
      printQuantity,
    },
    summary: summarizeArtworkPlans(artworkPlans),
    artworks: artworkPlans,
  };
};

module.exports = {
  DEFAULT_PRINT_QUANTITY,
  ORIGINAL_QUANTITY,
  buildShopifyCatalogPlan,
  createProductHandle,
  parsePrintQuantity,
};
