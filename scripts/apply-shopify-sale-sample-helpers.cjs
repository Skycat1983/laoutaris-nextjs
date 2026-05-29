const {
  createAdminGraphqlUrl,
  redactSensitiveText,
  validateRequiredEnv,
} = require("./reconcile-shopify-catalog-plan-helpers.cjs");

const DEFAULT_SELECTION_INPUT_PATH =
  "reports/shopify-sale-sample-selection.json";
const DEFAULT_OUTPUT_PATH = "reports/shopify-sale-sample-activation-report.json";
const ACTIVATE_SALE_SAMPLE_CONFIRMATION = "ACTIVATE_SHOPIFY_SALE_SAMPLE";
const DEFAULT_PUBLICATION_NAME = "Online Store";

const PUBLICATIONS_QUERY = `
  query ShopifySaleSamplePublications {
    publications(first: 50) {
      nodes {
        id
        name
      }
    }
  }
`;

const PRODUCT_ACTIVATE_MUTATION = `
  mutation ActivateShopifySaleSampleProduct($product: ProductUpdateInput!) {
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

const PRODUCT_PUBLISH_MUTATION = `
  mutation PublishShopifySaleSampleProduct($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable {
        ... on Product {
          id
          legacyResourceId
          handle
          title
          status
        }
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
    mode: "plan",
    publicationName: DEFAULT_PUBLICATION_NAME,
  };

  argv.forEach((arg) => {
    if (arg.startsWith("--selection=")) {
      options.selection = arg.slice("--selection=".length);
      return;
    }

    if (arg.startsWith("--input=")) {
      options.selection = arg.slice("--input=".length);
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

    if (arg.startsWith("--publication-id=")) {
      options.publicationId = arg.slice("--publication-id=".length);
      return;
    }

    if (arg.startsWith("--publication-name=")) {
      options.publicationName = arg.slice("--publication-name=".length);
      return;
    }

    throw new Error(`Unsupported option: ${arg}`);
  });

  if (!["plan", "write"].includes(options.mode)) {
    throw new Error("Mode must be plan or write.");
  }

  if (options.mode === "write") {
    if (options.confirm !== ACTIVATE_SALE_SAMPLE_CONFIRMATION) {
      throw new Error(
        `Sale sample activation requires --confirm=${ACTIVATE_SALE_SAMPLE_CONFIRMATION}.`
      );
    }
  } else if (options.confirm) {
    throw new Error("Plan mode does not accept a confirmation flag.");
  }

  return {
    selection: options.selection ?? DEFAULT_SELECTION_INPUT_PATH,
    output: options.output ?? DEFAULT_OUTPUT_PATH,
    mode: options.mode,
    confirm: options.confirm,
    publicationId: options.publicationId,
    publicationName: options.publicationName,
  };
};

const normalizeProductId = (value) => String(value ?? "").trim();

const validateSelection = (selection) => {
  const products = Array.isArray(selection.selectedProducts)
    ? selection.selectedProducts
    : [];
  const originals = products.filter(
    (product) => product.productFamily === "original"
  );
  const prints = products.filter((product) => product.productFamily === "print");
  const overlapArtworkIds = new Set(
    products
      .filter((product) => product.selectionGroup === "overlap")
      .map((product) => product.artworkId)
  );
  const productIds = products.map((product) => normalizeProductId(product.productId));
  const uniqueProductIds = new Set(productIds);

  if (originals.length !== 10) {
    throw new Error(`Selection must contain exactly 10 originals, found ${originals.length}.`);
  }

  if (prints.length !== 25) {
    throw new Error(`Selection must contain exactly 25 prints, found ${prints.length}.`);
  }

  if (overlapArtworkIds.size < 1 || overlapArtworkIds.size >= originals.length) {
    throw new Error("Selection must contain some, but not all, overlapping artworks.");
  }

  if (uniqueProductIds.size !== productIds.length) {
    throw new Error("Selection contains duplicate Shopify product IDs.");
  }

  for (const product of products) {
    if (!product.artworkId || !product.gid || !product.productId || !product.handle) {
      throw new Error("Every selected product must include artworkId, gid, productId, and handle.");
    }
  }

  return {
    products,
    originals,
    prints,
    overlapArtworkIds,
  };
};

const validateMongoEnv = (env) => {
  const mongoUri = String(env.MONGO_URI ?? "").trim();

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI.");
  }

  return { mongoUri };
};

const buildActivationReport = ({
  selection,
  options,
  source,
  generatedAt,
}) => {
  const validated = validateSelection(selection);

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode:
      options.mode === "write"
        ? "shopify_sale_sample_activation_write"
        : "shopify_sale_sample_activation_plan",
    source,
    safety: {
      requestedMode: options.mode,
      confirmationRequired:
        options.mode === "write" ? ACTIVATE_SALE_SAMPLE_CONFIRMATION : null,
      confirmationPresent:
        options.mode === "write" &&
        options.confirm === ACTIVATE_SALE_SAMPLE_CONFIRMATION,
      mongoWritesAllowed: options.mode === "write",
      shopifyMutationsAllowed: options.mode === "write",
      cloudinaryWritesAllowed: false,
      tokensPersisted: false,
    },
    requestedPublication: {
      publicationId: options.publicationId ?? null,
      publicationName: options.publicationName ?? DEFAULT_PUBLICATION_NAME,
      resolvedPublication: null,
      resolutionError: null,
    },
    summary: summarizeProducts(validated.products),
    products: validated.products.map((product) => ({
      ...product,
      mongoAction: "pending",
      mongoWriteResult: null,
      shopifyStatusAction: "pending",
      shopifyStatusResponse: null,
      shopifyPublishAction: "pending",
      shopifyPublishResponse: null,
      error: null,
    })),
    noMutationStatement:
      options.mode === "write"
        ? "Write mode sets selected MongoDB product links public and activates/publishes selected Shopify products only."
        : "Plan mode is read-only and does not mutate MongoDB, Shopify, or Cloudinary.",
  };
};

const summarizeProducts = (products) => ({
  selectedOriginals: products.filter(
    (product) => product.productFamily === "original"
  ).length,
  selectedPrints: products.filter((product) => product.productFamily === "print")
    .length,
  selectedProducts: products.length,
  mongoUpdated: products.filter((product) => product.mongoAction === "updated")
    .length,
  mongoAlreadyMatched: products.filter(
    (product) => product.mongoAction === "already_public"
  ).length,
  mongoFailed: products.filter((product) => product.mongoAction === "failed")
    .length,
  shopifyStatusUpdated: products.filter(
    (product) => product.shopifyStatusAction === "activated"
  ).length,
  shopifyStatusFailed: products.filter(
    (product) => product.shopifyStatusAction === "failed"
  ).length,
  shopifyPublished: products.filter(
    (product) => product.shopifyPublishAction === "published"
  ).length,
  shopifyPublishFailed: products.filter(
    (product) => product.shopifyPublishAction === "failed"
  ).length,
});

const updateReportSummary = (report) => {
  report.summary = summarizeProducts(report.products);
};

const createActivateMutationVariables = (shopifyProductGid) => ({
  product: {
    id: shopifyProductGid,
    status: "ACTIVE",
  },
});

const createPublishMutationVariables = ({ shopifyProductGid, publicationId }) => ({
  id: shopifyProductGid,
  input: [
    {
      publicationId,
    },
  ],
});

const resolvePublication = ({ publications, publicationId, publicationName }) => {
  const nodes = Array.isArray(publications) ? publications : [];

  if (publicationId) {
    const exact = nodes.find((publication) => publication?.id === publicationId);

    if (!exact) {
      throw new Error(`Publication ID was not found: ${publicationId}`);
    }

    return exact;
  }

  const normalizedName = String(publicationName ?? DEFAULT_PUBLICATION_NAME)
    .trim()
    .toLowerCase();
  const exactName = nodes.find(
    (publication) => String(publication?.name ?? "").trim().toLowerCase() === normalizedName
  );

  if (exactName) {
    return exactName;
  }

  const onlineStore = nodes.find((publication) =>
    String(publication?.name ?? "").toLowerCase().includes("online store")
  );

  if (onlineStore) {
    return onlineStore;
  }

  throw new Error(
    `Could not resolve a Shopify publication named ${publicationName}.`
  );
};

const hasActivationFailures = (report) =>
  report.summary.mongoFailed > 0 ||
  report.summary.shopifyStatusFailed > 0 ||
  report.summary.shopifyPublishFailed > 0 ||
  Boolean(report.requestedPublication.resolutionError);

module.exports = {
  ACTIVATE_SALE_SAMPLE_CONFIRMATION,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_PUBLICATION_NAME,
  DEFAULT_SELECTION_INPUT_PATH,
  PRODUCT_ACTIVATE_MUTATION,
  PRODUCT_PUBLISH_MUTATION,
  PUBLICATIONS_QUERY,
  buildActivationReport,
  createActivateMutationVariables,
  createAdminGraphqlUrl,
  createPublishMutationVariables,
  hasActivationFailures,
  parseArgs,
  redactSensitiveText,
  resolvePublication,
  updateReportSummary,
  validateMongoEnv,
  validateRequiredEnv,
  validateSelection,
};
