const DEFAULT_RECONCILIATION_INPUT_PATH =
  "reports/shopify-catalog-post-draft-create-reconciliation-report.json";
const DEFAULT_SELECTION_OUTPUT_PATH =
  "reports/shopify-sale-sample-selection.json";
const DEFAULT_ORIGINAL_COUNT = 10;
const DEFAULT_PRINT_COUNT = 25;
const DEFAULT_OVERLAP_COUNT = 7;

const parsePositiveInteger = (value, optionName) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${optionName} must be a non-negative integer.`);
  }

  return parsed;
};

const parseArgs = (argv) => {
  const options = {};

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

    if (arg.startsWith("--seed=")) {
      options.seed = arg.slice("--seed=".length);
      return;
    }

    if (arg.startsWith("--original-count=")) {
      options.originalCount = parsePositiveInteger(
        arg.slice("--original-count=".length),
        "original-count"
      );
      return;
    }

    if (arg.startsWith("--print-count=")) {
      options.printCount = parsePositiveInteger(
        arg.slice("--print-count=".length),
        "print-count"
      );
      return;
    }

    if (arg.startsWith("--overlap-count=")) {
      options.overlapCount = parsePositiveInteger(
        arg.slice("--overlap-count=".length),
        "overlap-count"
      );
      return;
    }

    throw new Error(`Unsupported option: ${arg}`);
  });

  return {
    reconciliation:
      options.reconciliation ?? DEFAULT_RECONCILIATION_INPUT_PATH,
    output: options.output ?? DEFAULT_SELECTION_OUTPUT_PATH,
    seed: String(options.seed ?? "sale-sample-2026-05-29"),
    originalCount: options.originalCount ?? DEFAULT_ORIGINAL_COUNT,
    printCount: options.printCount ?? DEFAULT_PRINT_COUNT,
    overlapCount: options.overlapCount ?? DEFAULT_OVERLAP_COUNT,
  };
};

const createSeededRandom = (seed) => {
  let hash = 2166136261;

  for (const char of String(seed)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleWithSeed = (items, seed) => {
  const random = createSeededRandom(seed);
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

const getExactProduct = (artwork, productFamily) => {
  const products = Array.isArray(artwork.products) ? artwork.products : [];
  const product = products.find(
    (entry) =>
      entry?.productFamily === productFamily &&
      entry?.matchStatus === "exact_match" &&
      entry?.recommendedAction === "preserve_existing_product" &&
      entry?.handleMatch?.id &&
      entry?.handleMatch?.legacyResourceId &&
      entry?.handleMatch?.handle
  );

  if (!product) {
    return null;
  }

  return {
    productFamily,
    gid: product.handleMatch.id,
    productId: String(product.handleMatch.legacyResourceId),
    handle: product.handleMatch.handle,
    title: product.handleMatch.title ?? null,
    status: product.handleMatch.status ?? null,
    productType: product.handleMatch.productType ?? null,
    adminUrl: product.handleMatch.adminUrl ?? null,
  };
};

const normalizeArtworkCandidate = (artwork) => {
  const original = getExactProduct(artwork, "original");
  const print = getExactProduct(artwork, "print");

  if (!original || !print) {
    return null;
  }

  return {
    artworkId: String(artwork.artworkId ?? ""),
    title: artwork.title ?? null,
    artworkNumber: artwork.artworkNumber ?? null,
    original,
    print,
  };
};

const getArtworkSelectionKey = (artwork) =>
  String(artwork.artworkNumber ?? artwork.title ?? artwork.artworkId).trim();

const dedupeCandidatesByArtworkNumber = (candidates) => {
  const seen = new Set();
  const unique = [];

  for (const candidate of candidates) {
    const key = getArtworkSelectionKey(candidate);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(candidate);
  }

  return unique;
};

const validateSelectionCounts = ({ originalCount, printCount, overlapCount }) => {
  if (originalCount < 1) {
    throw new Error("original-count must be at least 1.");
  }

  if (printCount < 1) {
    throw new Error("print-count must be at least 1.");
  }

  if (overlapCount < 1) {
    throw new Error("overlap-count must be at least 1.");
  }

  if (overlapCount >= originalCount) {
    throw new Error("overlap-count must be lower than original-count.");
  }

  if (overlapCount >= printCount) {
    throw new Error("overlap-count must be lower than print-count.");
  }
};

const createSelectedProduct = ({ artwork, productFamily, selectionGroup }) => {
  const product = artwork[productFamily];

  return {
    artworkId: artwork.artworkId,
    artworkTitle: artwork.title,
    artworkNumber: artwork.artworkNumber,
    productFamily,
    selectionGroup,
    gid: product.gid,
    productId: product.productId,
    handle: product.handle,
    title: product.title,
    currentStatusFromReconciliation: product.status,
    productType: product.productType,
    adminUrl: product.adminUrl,
    desiredShopifyStatus: "ACTIVE",
    desiredPublicListing: true,
  };
};

const buildSaleSampleSelection = ({
  reconciliation,
  seed,
  originalCount,
  printCount,
  overlapCount,
  source,
  generatedAt,
}) => {
  validateSelectionCounts({ originalCount, printCount, overlapCount });

  const candidates = dedupeCandidatesByArtworkNumber(
    (reconciliation.artworks ?? []).map(normalizeArtworkCandidate).filter(Boolean)
  );
  const requiredArtworkCount = overlapCount + (originalCount - overlapCount) +
    (printCount - overlapCount);

  if (candidates.length < requiredArtworkCount) {
    throw new Error(
      `Need at least ${requiredArtworkCount} exact-match artworks, found ${candidates.length}.`
    );
  }

  const shuffled = shuffleWithSeed(candidates, seed);
  const overlapArtworks = shuffled.slice(0, overlapCount);
  const originalOnlyArtworks = shuffled.slice(overlapCount, originalCount);
  const printOnlyArtworks = shuffled.slice(
    originalCount,
    originalCount + printCount - overlapCount
  );

  const selectedProducts = [
    ...overlapArtworks.flatMap((artwork) => [
      createSelectedProduct({
        artwork,
        productFamily: "original",
        selectionGroup: "overlap",
      }),
      createSelectedProduct({
        artwork,
        productFamily: "print",
        selectionGroup: "overlap",
      }),
    ]),
    ...originalOnlyArtworks.map((artwork) =>
      createSelectedProduct({
        artwork,
        productFamily: "original",
        selectionGroup: "original_only",
      })
    ),
    ...printOnlyArtworks.map((artwork) =>
      createSelectedProduct({
        artwork,
        productFamily: "print",
        selectionGroup: "print_only",
      })
    ),
  ];

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode: "shopify_sale_sample_selection",
    source,
    selectionPolicy: {
      seed,
      originalCount,
      printCount,
      overlapCount,
      originalOnlyCount: originalCount - overlapCount,
      printOnlyCount: printCount - overlapCount,
    },
    safety: {
      mongoWritesAllowed: false,
      shopifyMutationsAllowed: false,
      cloudinaryWritesAllowed: false,
      selectedProductsRequireSeparateActivation: true,
    },
    summary: {
      candidateArtworks: candidates.length,
      selectedOriginals: selectedProducts.filter(
        (product) => product.productFamily === "original"
      ).length,
      selectedPrints: selectedProducts.filter(
        (product) => product.productFamily === "print"
      ).length,
      overlapArtworks: overlapArtworks.length,
      originalOnlyArtworks: originalOnlyArtworks.length,
      printOnlyArtworks: printOnlyArtworks.length,
      selectedProducts: selectedProducts.length,
    },
    selectedArtworks: [
      ...overlapArtworks.map((artwork) => ({
        artworkId: artwork.artworkId,
        title: artwork.title,
        artworkNumber: artwork.artworkNumber,
        selectionGroup: "overlap",
      })),
      ...originalOnlyArtworks.map((artwork) => ({
        artworkId: artwork.artworkId,
        title: artwork.title,
        artworkNumber: artwork.artworkNumber,
        selectionGroup: "original_only",
      })),
      ...printOnlyArtworks.map((artwork) => ({
        artworkId: artwork.artworkId,
        title: artwork.title,
        artworkNumber: artwork.artworkNumber,
        selectionGroup: "print_only",
      })),
    ],
    selectedProducts,
    noMutationStatement:
      "This selection report is local planning evidence only and does not mutate MongoDB, Shopify, or Cloudinary.",
  };
};

module.exports = {
  DEFAULT_ORIGINAL_COUNT,
  DEFAULT_OVERLAP_COUNT,
  DEFAULT_PRINT_COUNT,
  DEFAULT_RECONCILIATION_INPUT_PATH,
  DEFAULT_SELECTION_OUTPUT_PATH,
  buildSaleSampleSelection,
  parseArgs,
  shuffleWithSeed,
};
