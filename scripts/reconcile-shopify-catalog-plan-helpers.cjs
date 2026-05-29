const DEFAULT_PLAN_INPUT_PATH = "reports/shopify-catalog-dry-run-plan.json";
const DEFAULT_RECONCILIATION_OUTPUT_PATH =
  "reports/shopify-catalog-reconciliation-report.json";
const REQUIRED_ENV_VARS = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_ADMIN_API_VERSION",
  "SHOPIFY_ADMIN_ACCESS_TOKEN",
];

const PRODUCT_BY_HANDLE_QUERY = `
  query ReconcileProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      legacyResourceId
      handle
      title
      productType
      status
      tags
      totalInventory
      metafield(namespace: "custom", key: "mongodb_artwork_id") {
        namespace
        key
        value
        type
      }
    }
  }
`;

const PRODUCTS_BY_ARTWORK_METAFIELD_QUERY = `
  query ReconcileProductsByArtworkMetafield($query: String!) {
    products(first: 20, query: $query) {
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
          metafield(namespace: "custom", key: "mongodb_artwork_id") {
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

const PRODUCTS_BY_MANUAL_ARTWORK_NUMBER_QUERY = `
  query ReconcileProductsByManualArtworkNumber($query: String!) {
    products(first: 20, query: $query) {
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
          metafield(namespace: "custom", key: "mongodb_artwork_id") {
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

const SHOPIFY_PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/(\d+)$/;
const TOKEN_LIKE_PATTERN =
  /\b(?:shpat|shpca|shppa|shpss|shpua)_[A-Za-z0-9_-]+\b/g;
const ARTWORK_NUMBER_PATTERN = /\bno(?:\.|-|\s)?0*(\d{1,4})\b/gi;

const createSafetySummary = () => ({
  readOnly: true,
  shopifyMutationsAllowed: false,
  mongoWritesAllowed: false,
  cloudinaryWritesAllowed: false,
  tokensPersisted: false,
});

const parseArgs = (argv) => {
  const options = {};

  argv.forEach((arg) => {
    if (arg.startsWith("--input=")) {
      options.input = arg.slice("--input=".length);
      return;
    }

    if (arg.startsWith("--output=")) {
      options.output = arg.slice("--output=".length);
      return;
    }

    throw new Error(`Unsupported option: ${arg}`);
  });

  return options;
};

const validateRequiredEnv = (env) => {
  const normalizedEnv = REQUIRED_ENV_VARS.reduce((values, name) => {
    values[name] =
      env[name] === undefined || env[name] === null
        ? ""
        : String(env[name]).trim();
    return values;
  }, {});
  const missing = REQUIRED_ENV_VARS.filter((name) => !normalizedEnv[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Shopify Admin environment variables: ${missing.join(
        ", "
      )}.`
    );
  }

  const shopDomain = normalizedEnv.SHOPIFY_STORE_DOMAIN;

  if (shopDomain.startsWith("http://") || shopDomain.startsWith("https://")) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN must be the .myshopify.com domain without protocol."
    );
  }

  return {
    shopDomain,
    adminApiVersion: normalizedEnv.SHOPIFY_ADMIN_API_VERSION,
    adminAccessToken: normalizedEnv.SHOPIFY_ADMIN_ACCESS_TOKEN,
  };
};

const validatePlanInput = (plan) => {
  if (!plan || typeof plan !== "object" || !Array.isArray(plan.artworks)) {
    throw new Error("Invalid plan input: expected an artworks array.");
  }

  const artworks = plan.artworks.map((artwork, artworkIndex) => {
    if (!Array.isArray(artwork?.products)) {
      throw new Error(
        `Invalid plan input: artwork at index ${artworkIndex} lacks products.`
      );
    }

    if (
      typeof artwork.customMongodbArtworkId !== "string" ||
      artwork.customMongodbArtworkId.trim() === ""
    ) {
      throw new Error(
        `Invalid plan input: artwork at index ${artworkIndex} lacks customMongodbArtworkId.`
      );
    }

    const products = artwork.products.map((product, productIndex) => {
      if (
        typeof product?.proposedHandle !== "string" ||
        product.proposedHandle.trim() === ""
      ) {
        throw new Error(
          `Invalid plan input: product at artwork index ${artworkIndex}, product index ${productIndex} lacks proposedHandle.`
        );
      }

      if (
        typeof product.productFamily !== "string" ||
        product.productFamily.trim() === ""
      ) {
        throw new Error(
          `Invalid plan input: product at artwork index ${artworkIndex}, product index ${productIndex} lacks productFamily.`
        );
      }

      return {
        ...product,
        proposedHandle: product.proposedHandle.trim(),
        productFamily: product.productFamily.trim(),
      };
    });

    return {
      ...artwork,
      customMongodbArtworkId: artwork.customMongodbArtworkId.trim(),
      products,
    };
  });

  return {
    ...plan,
    artworks,
  };
};

const buildMetafieldSearchQuery = (artworkId) => {
  const normalizedArtworkId = String(artworkId).trim().replace(/"/g, '\\"');
  return `metafields.custom.mongodb_artwork_id:${normalizedArtworkId}`;
};

const normalizeArtworkNumberValue = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  const normalized = String(Number.parseInt(digits, 10));

  if (normalized === "NaN") {
    return null;
  }

  return {
    normalized,
    padded: normalized.padStart(3, "0"),
  };
};

const getArtworkNumberFromTitle = (title) => {
  if (typeof title !== "string") {
    return null;
  }

  ARTWORK_NUMBER_PATTERN.lastIndex = 0;
  const match = ARTWORK_NUMBER_PATTERN.exec(title);

  return match ? normalizeArtworkNumberValue(match[1]) : null;
};

const getArtworkNumbersFromProduct = (product) => {
  const text = [product?.handle, product?.title]
    .filter((value) => typeof value === "string")
    .join(" ");
  const numbers = new Map();

  ARTWORK_NUMBER_PATTERN.lastIndex = 0;

  for (const match of text.matchAll(ARTWORK_NUMBER_PATTERN)) {
    const number = normalizeArtworkNumberValue(match[1]);

    if (number) {
      numbers.set(number.normalized, number);
    }
  }

  return Array.from(numbers.values());
};

const productMatchesArtworkNumber = (product, artworkNumber) => {
  if (!artworkNumber) {
    return false;
  }

  return getArtworkNumbersFromProduct(product).some(
    (number) => number.normalized === artworkNumber.normalized
  );
};

const buildManualArtworkNumberSearchQuery = (artworkNumber) => {
  if (!artworkNumber) {
    return null;
  }

  return [
    `no-${artworkNumber.padded}`,
    `no${artworkNumber.padded}`,
    `"No.${artworkNumber.padded}"`,
  ].join(" OR ");
};

const createAdminGraphqlUrl = ({ shopDomain, adminApiVersion }) =>
  `https://${shopDomain}/admin/api/${adminApiVersion}/graphql.json`;

const getLegacyResourceId = (product) => {
  if (product?.legacyResourceId !== undefined && product.legacyResourceId !== null) {
    return String(product.legacyResourceId);
  }

  const gidMatch =
    typeof product?.id === "string" ? product.id.match(SHOPIFY_PRODUCT_GID_PATTERN) : null;

  return gidMatch?.[1] ?? null;
};

const getProductKey = (product) =>
  product?.id || product?.legacyResourceId || product?.handle || null;

const getCustomMongodbArtworkId = (product) => {
  if (typeof product?.customMongodbArtworkId === "string") {
    return product.customMongodbArtworkId.trim() || null;
  }

  const metafield = product?.metafield;

  if (!metafield) {
    return null;
  }

  return typeof metafield.value === "string" ? metafield.value.trim() || null : metafield.value;
};

const normalizeShopifyProduct = (product, { shopDomain } = {}) => {
  if (!product) {
    return null;
  }

  const legacyResourceId = getLegacyResourceId(product);
  const customMongodbArtworkId = getCustomMongodbArtworkId(product);
  const validationErrors = [];

  if (typeof product.id !== "string" || !product.id.trim()) {
    validationErrors.push({
      code: "missing_shopify_product_id",
      message: "Shopify product is missing id.",
    });
  } else if (!SHOPIFY_PRODUCT_GID_PATTERN.test(product.id)) {
    validationErrors.push({
      code: "malformed_shopify_product_id",
      message: "Shopify product id is not a Product GID.",
    });
  }

  if (typeof product.handle !== "string" || !product.handle.trim()) {
    validationErrors.push({
      code: "missing_handle",
      message: "Shopify product is missing handle.",
    });
  }

  if (
    product?.metafield &&
    product.metafield.value !== null &&
    product.metafield.value !== undefined &&
    typeof product.metafield.value !== "string"
  ) {
    validationErrors.push({
      code: "invalid_custom_mongodb_artwork_id",
      message: "custom.mongodb_artwork_id is not a string.",
    });
  }

  const summary = {
    id: product.id ?? null,
    legacyResourceId,
    handle: typeof product.handle === "string" ? product.handle : null,
    title: typeof product.title === "string" ? product.title : null,
    productType:
      typeof product.productType === "string" ? product.productType : "",
    status: typeof product.status === "string" ? product.status : null,
    tags: Array.isArray(product.tags)
      ? product.tags.filter((tag) => typeof tag === "string")
      : [],
    customMongodbArtworkId:
      typeof customMongodbArtworkId === "string" ? customMongodbArtworkId : null,
    totalInventory:
      typeof product.totalInventory === "number" ? product.totalInventory : null,
  };

  if (legacyResourceId && shopDomain) {
    summary.adminUrl = `https://${shopDomain}/admin/products/${legacyResourceId}`;
  }

  if (validationErrors.length > 0) {
    summary.validationErrors = validationErrors;
  }

  return summary;
};

const dedupeShopifyProducts = (products) => {
  const dedupedByKey = new Map();

  products.filter(Boolean).forEach((product) => {
    const key = getProductKey(product);

    if (!key) {
      dedupedByKey.set(`missing-key-${dedupedByKey.size}`, product);
      return;
    }

    if (!dedupedByKey.has(key)) {
      dedupedByKey.set(key, product);
    }
  });

  return Array.from(dedupedByKey.values());
};

const inferProductFamily = (product) => {
  const haystack = [
    product?.handle,
    product?.title,
    product?.productType,
    ...(Array.isArray(product?.tags) ? product.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const originalSignals = [
    "original artwork",
    "original-artwork",
    " original ",
    "-original-",
    "painting",
  ];
  const printSignals = ["fine art print", " fine-art-print ", " print ", "-print-"];

  const padded = ` ${haystack} `;
  const isOriginal = originalSignals.some((signal) => padded.includes(signal));
  const isPrint = printSignals.some((signal) => padded.includes(signal));

  if (isOriginal === isPrint) {
    return null;
  }

  return isOriginal ? "original" : "print";
};

const getDuplicateProductFamilies = (products) => {
  const countsByFamily = new Map();

  products.forEach((product) => {
    const family = inferProductFamily(product);

    if (!family) {
      return;
    }

    countsByFamily.set(family, (countsByFamily.get(family) ?? 0) + 1);
  });

  return Array.from(countsByFamily.entries())
    .filter(([, count]) => count > 1)
    .map(([family]) => family);
};

const getExactArtworkMetafieldMatches = (products, artworkId) =>
  dedupeShopifyProducts(products).filter(
    (product) => product.customMongodbArtworkId === artworkId
  );

const getIgnoredArtworkMetafieldMatches = (products, artworkId) =>
  dedupeShopifyProducts(products).filter(
    (product) => product.customMongodbArtworkId !== artworkId
  );

const createIgnoredMetafieldLookupWarning = (products) => {
  if (products.length === 0) {
    return null;
  }

  return {
    code: "ignored_non_matching_metafield_lookup_results",
    message:
      "Shopify products returned by the metafield search were ignored because custom.mongodb_artwork_id was missing or did not match this artwork.",
    count: products.length,
  };
};

const getManualNumberMatches = ({ products, artworkId, artworkNumber }) =>
  dedupeShopifyProducts(products).filter((product) => {
    if (!productMatchesArtworkNumber(product, artworkNumber)) {
      return false;
    }

    return (
      product.customMongodbArtworkId === null ||
      product.customMongodbArtworkId === artworkId
    );
  });

const getConflictingManualNumberMatches = ({ products, artworkId, artworkNumber }) =>
  dedupeShopifyProducts(products).filter(
    (product) =>
      productMatchesArtworkNumber(product, artworkNumber) &&
      product.customMongodbArtworkId !== null &&
      product.customMongodbArtworkId !== artworkId
  );

const createConflict = (code, message, product) => ({
  code,
  message,
  shopifyProductId: product?.id ?? null,
  shopifyProductHandle: product?.handle ?? null,
});

const hasSameProductIdentity = (firstProduct, secondProduct) => {
  if (!firstProduct || !secondProduct) {
    return false;
  }

  const firstKey = getProductKey(firstProduct);
  const secondKey = getProductKey(secondProduct);

  return Boolean(firstKey && secondKey && firstKey === secondKey);
};

const getLookupError = (lookup) =>
  lookup?.error ? String(lookup.error.message ?? lookup.error) : null;

const classifyPlannedProduct = ({
  artworkId,
  artworkNumber,
  plannedProduct,
  handleLookup,
  metafieldLookup,
  manualNumberLookup,
}) => {
  const handleMatch = handleLookup?.product ?? null;
  const allMetafieldMatches = metafieldLookup?.products ?? [];
  const manualNumberMatches = manualNumberLookup?.products ?? [];
  const conflicts = [];
  const warnings = [];
  const lookupErrors = [
    getLookupError(handleLookup),
    getLookupError(metafieldLookup),
    getLookupError(manualNumberLookup),
  ].filter(Boolean);
  const possibleManualNumberMatches = artworkNumber
    ? getManualNumberMatches({
        products: manualNumberMatches,
        artworkId,
        artworkNumber,
      })
    : [];
  const conflictingManualNumberMatches = artworkNumber
    ? getConflictingManualNumberMatches({
        products: manualNumberMatches,
        artworkId,
        artworkNumber,
      })
    : [];
  const manualProductsToValidate = dedupeShopifyProducts([
    ...possibleManualNumberMatches,
    ...conflictingManualNumberMatches,
  ]);

  const productsToValidate = [
    handleMatch,
    ...allMetafieldMatches,
    ...manualProductsToValidate,
  ].filter(Boolean);

  productsToValidate.forEach((product) => {
    (product.validationErrors ?? []).forEach((validationError) => {
      conflicts.push(
        createConflict(
          validationError.code,
          validationError.message,
          product
        )
      );
    });
  });

  const duplicateMetafieldFamilies =
    getDuplicateProductFamilies(allMetafieldMatches);

  if (duplicateMetafieldFamilies.length > 0) {
    conflicts.push(
      createConflict(
        "duplicate_shopify_products_by_artwork_id",
        "More than one Shopify product has this custom.mongodb_artwork_id for the same product family.",
        null
      )
    );
  }

  const compatibleMetafieldMatches = allMetafieldMatches.filter(
    (product) => inferProductFamily(product) === plannedProduct.productFamily
  );
  const ambiguousMetafieldMatches = allMetafieldMatches.filter(
    (product) => inferProductFamily(product) === null
  );
  const compatibleManualNumberMatches = possibleManualNumberMatches.filter(
    (product) => inferProductFamily(product) === plannedProduct.productFamily
  );
  const ambiguousManualNumberMatches = possibleManualNumberMatches.filter(
    (product) => inferProductFamily(product) === null
  );
  const differentFamilyManualNumberMatches = possibleManualNumberMatches.filter((product) => {
    const family = inferProductFamily(product);
    return family && family !== plannedProduct.productFamily;
  });

  ambiguousMetafieldMatches.forEach((product) => {
    conflicts.push(
      createConflict(
        "ambiguous_shopify_product_family",
        "Shopify product matched by artwork metafield cannot be assigned to original or print.",
        product
      )
    );
  });

  ambiguousManualNumberMatches.forEach((product) => {
    conflicts.push(
      createConflict(
        "ambiguous_manual_number_product_family",
        "Shopify product matched by manual artwork number cannot be assigned to original or print.",
        product
      )
    );
  });

  possibleManualNumberMatches.forEach((product) => {
    const productNumbers = getArtworkNumbersFromProduct(product);

    if (productNumbers.length > 1) {
      conflicts.push(
        createConflict(
          "ambiguous_manual_number_product_number",
          "Shopify product matched by manual artwork number contains multiple artwork-number signals in handle or title.",
          product
        )
      );
    }
  });

  if (compatibleManualNumberMatches.length > 1) {
    conflicts.push(
      createConflict(
        "multiple_manual_number_product_matches",
        "More than one Shopify product matched this artwork number and planned product family.",
        null
      )
    );
  }

  if (handleMatch) {
    const handleFamily = inferProductFamily(handleMatch);

    if (handleFamily && handleFamily !== plannedProduct.productFamily) {
      conflicts.push(
        createConflict(
          "handle_family_mismatch",
          "Shopify product matched by proposed handle appears to use a different product family.",
          handleMatch
        )
      );
    }

    if (
      handleMatch.customMongodbArtworkId &&
      handleMatch.customMongodbArtworkId !== artworkId
    ) {
      conflicts.push(
        createConflict(
          "handle_metafield_artwork_mismatch",
          "Proposed handle exists on a Shopify product with a different custom.mongodb_artwork_id.",
          handleMatch
        )
      );
    }
  }

  const handleMatchIsExact = handleMatch?.customMongodbArtworkId === artworkId;
  const metafieldMatchIsExact = compatibleMetafieldMatches.length > 0;

  if (
    conflictingManualNumberMatches.length > 0 &&
    !handleMatchIsExact &&
    !metafieldMatchIsExact
  ) {
    conflictingManualNumberMatches.forEach((product) => {
      conflicts.push(
        createConflict(
          "manual_number_match_metafield_artwork_mismatch",
          "Shopify product matched by manual artwork number has a different custom.mongodb_artwork_id.",
          product
        )
      );
    });
  } else if (conflictingManualNumberMatches.length > 0) {
    warnings.push({
      code: "manual_number_matches_other_artworks_ignored",
      message:
        "Other Shopify products matched the same artwork number but were ignored because the proposed handle or custom.mongodb_artwork_id matched this planned product exactly.",
      count: conflictingManualNumberMatches.length,
    });
  }

  if (
    handleMatch &&
    compatibleMetafieldMatches.length > 0 &&
    !compatibleMetafieldMatches.some((product) =>
      hasSameProductIdentity(product, handleMatch)
    )
  ) {
    conflicts.push(
      createConflict(
        "handle_and_metafield_return_different_products",
        "The proposed handle and custom.mongodb_artwork_id lookup returned different Shopify products.",
        handleMatch
      )
    );
  }

  if (lookupErrors.length > 0) {
    return {
      productFamily: plannedProduct.productFamily,
      proposedHandle: plannedProduct.proposedHandle,
      matchStatus: "query_error",
      recommendedAction: "retry_query_before_decision",
      handleMatch,
      metafieldMatches: compatibleMetafieldMatches,
      conflicts,
      warnings: warnings.concat(
        lookupErrors.map((message) => ({
          code: "shopify_query_error",
          message,
        }))
      ),
      manualNumberMatches: compatibleManualNumberMatches,
    };
  }

  if (conflicts.length > 0) {
    return {
      productFamily: plannedProduct.productFamily,
      proposedHandle: plannedProduct.proposedHandle,
      matchStatus: "conflict",
      recommendedAction: "manual_review_required",
      handleMatch,
      metafieldMatches: compatibleMetafieldMatches,
      conflicts,
      warnings,
      manualNumberMatches: compatibleManualNumberMatches,
    };
  }

  if (handleMatch) {
    const exactMetafieldMatch =
      handleMatch.customMongodbArtworkId === artworkId ||
      compatibleMetafieldMatches.some((product) =>
        hasSameProductIdentity(product, handleMatch)
      );

    if (exactMetafieldMatch) {
      return {
        productFamily: plannedProduct.productFamily,
        proposedHandle: plannedProduct.proposedHandle,
        matchStatus: "exact_match",
        recommendedAction: "preserve_existing_product",
        handleMatch,
        metafieldMatches: compatibleMetafieldMatches,
        conflicts,
        warnings,
        manualNumberMatches: [],
      };
    }

    return {
      productFamily: plannedProduct.productFamily,
      proposedHandle: plannedProduct.proposedHandle,
      matchStatus: "handle_only_match",
      recommendedAction: "preserve_existing_product",
      handleMatch,
      metafieldMatches: compatibleMetafieldMatches,
      conflicts,
      warnings,
      manualNumberMatches: [],
    };
  }

  if (compatibleMetafieldMatches.length === 1) {
    return {
      productFamily: plannedProduct.productFamily,
      proposedHandle: plannedProduct.proposedHandle,
      matchStatus: "metafield_only_match",
      recommendedAction: "preserve_existing_manual_handle",
      handleMatch: null,
      metafieldMatches: compatibleMetafieldMatches,
      conflicts,
      warnings,
      manualNumberMatches: [],
    };
  }

  if (compatibleManualNumberMatches.length === 1) {
    return {
      productFamily: plannedProduct.productFamily,
      proposedHandle: plannedProduct.proposedHandle,
      matchStatus: "manual_product_match",
      recommendedAction: "preserve_existing_manual_product",
      handleMatch: null,
      metafieldMatches: [],
      manualNumberMatches: compatibleManualNumberMatches,
      conflicts,
      warnings,
    };
  }

  if (!artworkNumber) {
    warnings.push({
      code: "missing_artwork_number_for_manual_match",
      message:
        "Artwork title does not contain a usable No. artwork number for manual Shopify product preservation matching.",
    });
  }

  if (differentFamilyManualNumberMatches.length > 0) {
    warnings.push({
      code: "manual_number_match_exists_for_other_family",
      message:
        "A Shopify product matched this artwork number for a different product family.",
      count: differentFamilyManualNumberMatches.length,
    });
  }

  return {
    productFamily: plannedProduct.productFamily,
    proposedHandle: plannedProduct.proposedHandle,
    matchStatus: "no_match",
    recommendedAction: "safe_to_create_later",
    handleMatch: null,
    metafieldMatches: [],
    manualNumberMatches: [],
    conflicts,
    warnings,
  };
};

const createEmptySummary = () => ({
  artworksScanned: 0,
  plannedProductsScanned: 0,
  plannedProductsWithExactMatch: 0,
  plannedProductsWithHandleOnlyMatch: 0,
  plannedProductsWithMetafieldOnlyMatch: 0,
  plannedProductsWithManualProductMatch: 0,
  plannedProductsWithNoMatch: 0,
  plannedProductsWithConflict: 0,
  shopifyProductsMatched: 0,
  duplicateShopifyProductsByArtworkId: 0,
  queryErrorCount: 0,
  manualReviewCount: 0,
});

const incrementStatusSummary = (summary, matchStatus) => {
  if (matchStatus === "exact_match") {
    summary.plannedProductsWithExactMatch += 1;
  } else if (matchStatus === "handle_only_match") {
    summary.plannedProductsWithHandleOnlyMatch += 1;
  } else if (matchStatus === "metafield_only_match") {
    summary.plannedProductsWithMetafieldOnlyMatch += 1;
  } else if (matchStatus === "manual_product_match") {
    summary.plannedProductsWithManualProductMatch += 1;
  } else if (matchStatus === "no_match") {
    summary.plannedProductsWithNoMatch += 1;
  } else if (matchStatus === "conflict") {
    summary.plannedProductsWithConflict += 1;
    summary.manualReviewCount += 1;
  } else if (matchStatus === "query_error") {
    summary.manualReviewCount += 1;
  }
};

const addMatchedProductKeys = (matchedKeys, productResult) => {
  [
    productResult.handleMatch,
    ...(productResult.metafieldMatches ?? []),
    ...(productResult.manualNumberMatches ?? []),
  ]
    .filter(Boolean)
    .forEach((product) => {
      const key = getProductKey(product);
      if (key) {
        matchedKeys.add(key);
      }
    });
};

const createQueryErrors = ({ handleLookups, metafieldLookups, manualNumberLookups }) => {
  const queryErrors = [];

  for (const [handle, lookup] of Object.entries(handleLookups ?? {})) {
    const message = getLookupError(lookup);

    if (message) {
      queryErrors.push({
        lookupType: "handle",
        proposedHandle: handle,
        message,
      });
    }
  }

  for (const [artworkId, lookup] of Object.entries(metafieldLookups ?? {})) {
    const message = getLookupError(lookup);

    if (message) {
      queryErrors.push({
        lookupType: "custom_mongodb_artwork_id",
        customMongodbArtworkId: artworkId,
        message,
      });
    }
  }

  for (const [artworkId, lookup] of Object.entries(manualNumberLookups ?? {})) {
    const message = getLookupError(lookup);

    if (message) {
      queryErrors.push({
        lookupType: "manual_artwork_number",
        customMongodbArtworkId: artworkId,
        message,
      });
    }
  }

  return queryErrors;
};

const buildReconciliationReport = ({
  plan,
  handleLookups,
  metafieldLookups,
  manualNumberLookups,
  source,
  generatedAt,
}) => {
  const validPlan = validatePlanInput(plan);
  const summary = createEmptySummary();
  const matchedProductKeys = new Set();

  summary.artworksScanned = validPlan.artworks.length;

  const artworks = validPlan.artworks.map((artwork) => {
    const artworkId = artwork.customMongodbArtworkId;
    const artworkNumber = getArtworkNumberFromTitle(artwork.title);
    const metafieldLookup = metafieldLookups?.[artworkId] ?? { products: [] };
    const manualNumberLookup = manualNumberLookups?.[artworkId] ?? {
      products: [],
    };
    const matchesByArtworkMetafield = dedupeShopifyProducts(
      getExactArtworkMetafieldMatches(metafieldLookup.products ?? [], artworkId)
    );
    const ignoredMetafieldMatches = getIgnoredArtworkMetafieldMatches(
      metafieldLookup.products ?? [],
      artworkId
    );
    const matchesByManualArtworkNumber = artworkNumber
      ? getManualNumberMatches({
          products: manualNumberLookup.products ?? [],
          artworkId,
          artworkNumber,
        })
      : [];
    const ignoredMetafieldWarning = createIgnoredMetafieldLookupWarning(
      ignoredMetafieldMatches
    );
    const conflicts = [];
    const warnings = ignoredMetafieldWarning ? [ignoredMetafieldWarning] : [];

    if (getDuplicateProductFamilies(matchesByArtworkMetafield).length > 0) {
      summary.duplicateShopifyProductsByArtworkId += 1;
      conflicts.push({
        code: "duplicate_shopify_products_by_artwork_id",
        message:
          "More than one Shopify product has this custom.mongodb_artwork_id for the same product family.",
      });
    }

    const products = artwork.products.map((plannedProduct) => {
      summary.plannedProductsScanned += 1;
      const productResult = classifyPlannedProduct({
        artworkId,
        artworkNumber,
        plannedProduct,
        handleLookup: handleLookups?.[plannedProduct.proposedHandle] ?? {
          product: null,
        },
        metafieldLookup: {
          ...metafieldLookup,
          products: matchesByArtworkMetafield,
        },
        manualNumberLookup: {
          ...manualNumberLookup,
          products: manualNumberLookup.products ?? [],
        },
      });

      incrementStatusSummary(summary, productResult.matchStatus);
      addMatchedProductKeys(matchedProductKeys, productResult);
      return productResult;
    });

    return {
      artworkId: artwork.artworkId ?? artworkId,
      title: artwork.title ?? null,
      customMongodbArtworkId: artworkId,
      artworkNumber: artworkNumber?.padded ?? null,
      matchesByArtworkMetafield,
      matchesByManualArtworkNumber,
      products,
      conflicts,
      warnings,
    };
  });

  const queryErrors = createQueryErrors({
    handleLookups,
    metafieldLookups,
    manualNumberLookups,
  });

  summary.shopifyProductsMatched = matchedProductKeys.size;
  summary.queryErrorCount = queryErrors.length;

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    mode: "read_only_shopify_reconciliation",
    source,
    safety: createSafetySummary(),
    summary,
    artworks,
    queryErrors,
  };
};

const hasBlockingReconciliationFindings = (report) =>
  report.summary.plannedProductsWithConflict > 0 ||
  report.summary.queryErrorCount > 0;

const redactSensitiveText = (value, sensitiveValues = []) => {
  let text =
    value instanceof Error
      ? value.message
      : typeof value === "string"
        ? value
        : JSON.stringify(value);

  if (typeof text !== "string") {
    text = String(value);
  }

  sensitiveValues.filter(Boolean).forEach((sensitiveValue) => {
    text = text.split(String(sensitiveValue)).join("[REDACTED]");
  });

  return text
    .replace(
      /(X-Shopify-Access-Token["'\s:=]+)([^"',\s}]+)/gi,
      "$1[REDACTED]"
    )
    .replace(/(access[_-]?token["'\s:=]+)([^"',\s}]+)/gi, "$1[REDACTED]")
    .replace(TOKEN_LIKE_PATTERN, "[REDACTED]");
};

module.exports = {
  DEFAULT_PLAN_INPUT_PATH,
  DEFAULT_RECONCILIATION_OUTPUT_PATH,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_BY_ARTWORK_METAFIELD_QUERY,
  PRODUCTS_BY_MANUAL_ARTWORK_NUMBER_QUERY,
  buildManualArtworkNumberSearchQuery,
  buildMetafieldSearchQuery,
  buildReconciliationReport,
  createAdminGraphqlUrl,
  createSafetySummary,
  dedupeShopifyProducts,
  getArtworkNumberFromTitle,
  hasBlockingReconciliationFindings,
  inferProductFamily,
  normalizeShopifyProduct,
  parseArgs,
  redactSensitiveText,
  validatePlanInput,
  validateRequiredEnv,
};
