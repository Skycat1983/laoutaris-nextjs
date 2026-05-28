const slugify = require("slugify");

const DEFAULT_PRINT_QUANTITY = 50;
const ORIGINAL_QUANTITY = 1;
const HANDLE_PREFIX = "joseph-laoutaris";
const PRODUCT_VENDOR = "Joseph Laoutaris";
const PRODUCT_STATUS = "DRAFT";
const PRINT_OPTION_NAME = "Frame package";
const PRINT_OPTION_VALUE = "Unframed";

const TAXONOMY_FIELDS = ["decade", "artstyle", "medium", "surface"];

const EXPLICIT_EXCLUSIONS = [
  "shopifyProducts",
  "watcherlist",
  "favourited",
  "user watchlist",
  "user favourites",
  "comments",
  "accounts",
  "enquiry data",
  "collection ObjectIds",
  "collection metadata",
  "image.bytes",
  "image.hexColors",
  "image.predominantColors",
  "createdAt",
  "updatedAt",
  "__v",
  "framed purchasable options",
  "material purchasable options",
  "mat purchasable options",
  "room-preview frame profile values",
  "owner price rules",
  "sale copy",
  "sales-channel publication",
  "checkout/cart state",
  "MongoDB shopifyProducts link writes",
];

const PRODUCT_DEFINITIONS = {
  original: {
    productFamily: "original",
    titleSuffix: "Original Artwork",
    productType: "Original Artwork",
    tags: ["archive-artwork", "original", "painting"],
    inventoryQuantity: ORIGINAL_QUANTITY,
  },
  print: {
    productFamily: "print",
    titleSuffix: "Fine Art Print",
    productType: "Fine Art Print",
    tags: ["archive-artwork", "print", "fine-art-print"],
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

const toOptionalString = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const toOptionalInteger = (value) =>
  Number.isInteger(value) && value > 0 ? value : null;

const createTaxonomyTag = (field, value) => {
  const slug = slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

  return slug ? `${field}-${slug}` : null;
};

const normalizeTaxonomy = (artwork, warnings) => {
  return TAXONOMY_FIELDS.reduce((taxonomy, field) => {
    const value = artwork?.[field];

    if (typeof value === "string" && value.trim()) {
      taxonomy[field] = value.trim();
      return taxonomy;
    }

    taxonomy[field] = null;

    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      warnings.push({
        code: "missing_required_metadata",
        field,
        message: `Artwork is missing required ${field} metadata.`,
      });
      return taxonomy;
    }

    warnings.push({
      code: "unsupported_required_metadata",
      field,
      message: `Artwork ${field} metadata must be a non-empty string.`,
    });

    return taxonomy;
  }, {});
};

const normalizeFeatured = (artwork, warnings) => {
  const value = artwork?.featured;

  if (typeof value === "boolean") {
    return value;
  }

  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return null;
  }

  warnings.push({
    code: "unsupported_optional_metadata",
    field: "featured",
    message: "Artwork featured metadata must be true or false when present.",
  });

  return null;
};

const createTaxonomyTags = ({ taxonomy, featured }) => {
  const tags = TAXONOMY_FIELDS.map((field) =>
    taxonomy[field] ? createTaxonomyTag(field, taxonomy[field]) : null
  ).filter(Boolean);

  if (featured === true) {
    tags.push("featured-artwork");
  }

  return tags;
};

const extractArtworkNumber = (title) => {
  const match = String(title ?? "").match(/\bNo\.?\s*(\d+)\b/i);

  return match ? `No.${match[1]}` : null;
};

const normalizeSelectedArchiveImage = (artwork, warnings) => {
  const image = artwork?.image ?? {};
  const metadata = {
    secureUrl: toOptionalString(image.secure_url),
    publicId: toOptionalString(image.public_id),
    pixelWidth: toOptionalInteger(image.pixelWidth),
    pixelHeight: toOptionalInteger(image.pixelHeight),
    format: toOptionalString(image.format),
  };

  if (!metadata.secureUrl) {
    warnings.push({
      code: "missing_image",
      field: "image.secure_url",
      message: "Artwork is missing image.secure_url.",
    });
  }

  [
    ["pixelWidth", "image.pixelWidth"],
    ["pixelHeight", "image.pixelHeight"],
  ].forEach(([key, field]) => {
    if (
      image[key] !== undefined &&
      image[key] !== null &&
      metadata[key] === null
    ) {
      warnings.push({
        code: "unsupported_optional_metadata",
        field,
        message: `${field} must be a positive integer when present.`,
      });
    }
  });

  return metadata;
};

const createMetafield = ({ key, type, value }) => ({
  namespace: "custom",
  key,
  type,
  value,
});

const createCustomMetafields = ({
  artworkId,
  title,
  artworkNumber,
  taxonomy,
  featured,
  selectedArchiveImage,
  productFamily,
  printQuantity,
}) => {
  const metafields = [
    createMetafield({
      key: "mongodb_artwork_id",
      type: "single_line_text_field",
      value: artworkId || null,
    }),
    createMetafield({
      key: "artwork_title",
      type: "single_line_text_field",
      value: title || null,
    }),
    createMetafield({
      key: "artwork_decade",
      type: "single_line_text_field",
      value: taxonomy.decade,
    }),
    createMetafield({
      key: "artwork_artstyle",
      type: "single_line_text_field",
      value: taxonomy.artstyle,
    }),
    createMetafield({
      key: "artwork_medium",
      type: "single_line_text_field",
      value: taxonomy.medium,
    }),
    createMetafield({
      key: "artwork_surface",
      type: "single_line_text_field",
      value: taxonomy.surface,
    }),
    createMetafield({
      key: "artwork_featured",
      type: "boolean",
      value: featured,
    }),
    createMetafield({
      key: "archive_image_url",
      type: "url",
      value: selectedArchiveImage.secureUrl,
    }),
    createMetafield({
      key: "archive_image_public_id",
      type: "single_line_text_field",
      value: selectedArchiveImage.publicId,
    }),
    createMetafield({
      key: "archive_image_width",
      type: "number_integer",
      value: selectedArchiveImage.pixelWidth,
    }),
    createMetafield({
      key: "archive_image_height",
      type: "number_integer",
      value: selectedArchiveImage.pixelHeight,
    }),
    createMetafield({
      key: "archive_image_format",
      type: "single_line_text_field",
      value: selectedArchiveImage.format,
    }),
  ];

  if (artworkNumber) {
    metafields.splice(
      2,
      0,
      createMetafield({
        key: "artwork_number",
        type: "single_line_text_field",
        value: artworkNumber,
      })
    );
  }

  if (productFamily === "print") {
    metafields.push(
      createMetafield({
        key: "print_edition_quantity",
        type: "number_integer",
        value: printQuantity,
      })
    );
  }

  return metafields;
};

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

const createProductPlan = ({
  artworkId,
  title,
  productFamily,
  printQuantity,
  taxonomy,
  taxonomyTags,
  featured,
  selectedArchiveImage,
  artworkWarnings,
}) => {
  const definition = PRODUCT_DEFINITIONS[productFamily];
  const inventoryQuantity =
    productFamily === "print"
      ? printQuantity
      : definition.inventoryQuantity;
  const generatedTitle = title ? `${title} - ${definition.titleSuffix}` : null;
  const variants =
    productFamily === "print"
      ? [
          {
            optionName: PRINT_OPTION_NAME,
            optionValue: PRINT_OPTION_VALUE,
            title: PRINT_OPTION_VALUE,
            inventoryQuantity,
            inventoryPolicy: "deny",
          },
        ]
      : [
          {
            title: "Default Title",
            inventoryQuantity,
            inventoryPolicy: "deny",
          },
        ];

  const productPlan = {
    productFamily: definition.productFamily,
    proposedHandle: createProductHandle({
      artworkId,
      productFamily,
      title,
    }),
    title: generatedTitle,
    vendor: PRODUCT_VENDOR,
    productType: definition.productType,
    tags: [...definition.tags, ...taxonomyTags],
    inventoryQuantity,
    inventoryPolicy: "deny",
    status: PRODUCT_STATUS,
    media: selectedArchiveImage.secureUrl
      ? [
          {
            sourceUrl: selectedArchiveImage.secureUrl,
            alt: generatedTitle,
          },
        ]
      : [],
    selectedArchiveImage,
    variants,
    metafields: createCustomMetafields({
      artworkId,
      title,
      artworkNumber: extractArtworkNumber(title),
      taxonomy,
      featured,
      selectedArchiveImage,
      productFamily,
      printQuantity,
    }),
    warnings: [...artworkWarnings],
  };

  if (productFamily === "print") {
    productPlan.printEditionQuantity = printQuantity;
  }

  return productPlan;
};

const createArtworkPlan = (artwork, options) => {
  const artworkId = toArtworkId(artwork);
  const title = toArtworkTitle(artwork);
  const warnings = [];

  if (!artworkId) {
    warnings.push({
      code: "unsupported_required_metadata",
      field: "_id",
      message: "Artwork is missing a MongoDB _id.",
    });
  }

  if (!title) {
    warnings.push({
      code: "missing_title",
      field: "title",
      message: "Artwork is missing a usable title.",
    });
  }

  const taxonomy = normalizeTaxonomy(artwork, warnings);
  const featured = normalizeFeatured(artwork, warnings);
  const taxonomyTags = createTaxonomyTags({ taxonomy, featured });
  const selectedArchiveImage = normalizeSelectedArchiveImage(artwork, warnings);
  const imageUrl = selectedArchiveImage.secureUrl;
  const imageUrlPresent = Boolean(imageUrl);

  const originalProduct = createProductPlan({
    artworkId,
    title,
    productFamily: "original",
    printQuantity: options.printQuantity,
    taxonomy,
    taxonomyTags,
    featured,
    selectedArchiveImage,
    artworkWarnings: warnings,
  });
  const printProduct = createProductPlan({
    artworkId,
    title,
    productFamily: "print",
    printQuantity: options.printQuantity,
    taxonomy,
    taxonomyTags,
    featured,
    selectedArchiveImage,
    artworkWarnings: warnings,
  });

  return {
    artworkId: artworkId || null,
    title: title || null,
    taxonomy,
    featured,
    imageUrlPresent,
    imageUrl,
    selectedArchiveImage,
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
    artworksMissingRequiredMetadata: artworkPlans.filter((artworkPlan) =>
      artworkPlan.warnings.some(
        (warning) => warning.code === "missing_required_metadata"
      )
    ).length,
    duplicateGeneratedHandleCount: products.filter((product) =>
      product.warnings.some(
        (warning) => warning.code === "duplicate_generated_handle"
      )
    ).length,
    unsupportedRequiredMetadataCount: artworkPlans.filter((artworkPlan) =>
      artworkPlan.warnings.some(
        (warning) => warning.code === "unsupported_required_metadata"
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
    explicitExclusions: EXPLICIT_EXCLUSIONS,
    summary: summarizeArtworkPlans(artworkPlans),
    artworks: artworkPlans,
  };
};

module.exports = {
  DEFAULT_PRINT_QUANTITY,
  EXPLICIT_EXCLUSIONS,
  ORIGINAL_QUANTITY,
  buildShopifyCatalogPlan,
  createCustomMetafields,
  createProductHandle,
  createTaxonomyTags,
  extractArtworkNumber,
  parsePrintQuantity,
};
