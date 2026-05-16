const SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN = /^\d+$/;
const SHOPIFY_PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\//i;
const VALID_PRODUCT_TYPES = ["original", "print", "book"];
const VALID_PRODUCT_TYPE_SET = new Set(VALID_PRODUCT_TYPES);

const stringifyValue = (value) => {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  return JSON.stringify(value);
};

const toArtworkId = (artwork) => {
  const id = artwork?._id;

  if (id && typeof id.toString === "function") {
    return id.toString();
  }

  return id === undefined || id === null ? "(missing _id)" : String(id);
};

const toArtworkTitle = (artwork) => {
  return typeof artwork?.title === "string" && artwork.title.trim()
    ? artwork.title
    : "(untitled)";
};

const classifyShopifyProductId = (productId) => {
  if (typeof productId !== "string") {
    return {
      valid: false,
      normalizedProductId: null,
      reason: "non_string",
    };
  }

  if (productId === "") {
    return {
      valid: false,
      normalizedProductId: null,
      reason: "empty",
    };
  }

  const trimmedProductId = productId.trim();

  if (trimmedProductId === "") {
    return {
      valid: false,
      normalizedProductId: null,
      reason: "whitespace",
    };
  }

  if (SHOPIFY_PRODUCT_GID_PATTERN.test(trimmedProductId)) {
    return {
      valid: false,
      normalizedProductId: null,
      reason: "shopify_gid",
    };
  }

  if (!SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN.test(trimmedProductId)) {
    return {
      valid: false,
      normalizedProductId: null,
      reason: "non_numeric",
    };
  }

  return {
    valid: true,
    normalizedProductId: trimmedProductId,
    reason: null,
  };
};

const classifyShopifyProductType = (type) => {
  if (VALID_PRODUCT_TYPE_SET.has(type)) {
    return {
      valid: true,
      reason: null,
    };
  }

  return {
    valid: false,
    reason: typeof type === "string" && type.trim() ? "unknown" : "missing",
  };
};

const createProductTypeMap = () => {
  return VALID_PRODUCT_TYPES.reduce((map, productType) => {
    map[productType] = new Map();
    return map;
  }, {});
};

const createAuditState = () => ({
  summary: {
    totalArtworksScanned: 0,
    artworksWithShopifyLinks: 0,
    totalLinks: 0,
    invalidProductIdCount: 0,
    unknownProductTypeCount: 0,
    withinArtworkDuplicateCount: 0,
    crossArtworkDuplicateCount: 0,
  },
  invalidProductIds: [],
  unknownProductTypes: [],
  withinArtworkDuplicates: [],
  crossArtworkDuplicates: [],
  productOccurrencesByType: createProductTypeMap(),
});

const addOccurrence = (occurrencesByType, productType, productId, occurrence) => {
  const productMap = occurrencesByType[productType];
  const existingOccurrences = productMap.get(productId) ?? [];
  existingOccurrences.push(occurrence);
  productMap.set(productId, existingOccurrences);
};

const recordArtwork = (state, artwork) => {
  state.summary.totalArtworksScanned += 1;

  const links = Array.isArray(artwork?.shopifyProducts)
    ? artwork.shopifyProducts
    : [];

  if (links.length > 0) {
    state.summary.artworksWithShopifyLinks += 1;
    state.summary.totalLinks += links.length;
  }

  const validIdsInArtwork = new Map();
  const artworkId = toArtworkId(artwork);
  const title = toArtworkTitle(artwork);

  links.forEach((link, index) => {
    const productIdResult = classifyShopifyProductId(link?.productId);
    const typeResult = classifyShopifyProductType(link?.type);
    const occurrence = {
      artworkId,
      title,
      linkIndex: index,
      type: link?.type,
    };

    if (!productIdResult.valid) {
      state.invalidProductIds.push({
        ...occurrence,
        productId: link?.productId,
        reason: productIdResult.reason,
      });
    }

    if (!typeResult.valid) {
      state.unknownProductTypes.push({
        ...occurrence,
        productId: link?.productId,
        reason: typeResult.reason,
      });
    }

    if (!productIdResult.valid) {
      return;
    }

    const normalizedProductId = productIdResult.normalizedProductId;
    const occurrencesForArtwork =
      validIdsInArtwork.get(normalizedProductId) ?? [];

    occurrencesForArtwork.push(occurrence);
    validIdsInArtwork.set(normalizedProductId, occurrencesForArtwork);

    if (typeResult.valid) {
      addOccurrence(
        state.productOccurrencesByType,
        link.type,
        normalizedProductId,
        occurrence
      );
    }
  });

  for (const [productId, occurrences] of validIdsInArtwork.entries()) {
    if (occurrences.length <= 1) {
      continue;
    }

    state.withinArtworkDuplicates.push({
      artworkId,
      title,
      productId,
      count: occurrences.length,
      linkIndexes: occurrences.map((occurrence) => occurrence.linkIndex),
      types: Array.from(new Set(occurrences.map((occurrence) => occurrence.type))),
    });
  }
};

const uniqueArtworkOccurrences = (occurrences) => {
  const seen = new Map();

  occurrences.forEach((occurrence) => {
    const current = seen.get(occurrence.artworkId);

    if (!current) {
      seen.set(occurrence.artworkId, {
        artworkId: occurrence.artworkId,
        title: occurrence.title,
        linkIndexes: [occurrence.linkIndex],
      });
      return;
    }

    current.linkIndexes.push(occurrence.linkIndex);
  });

  return Array.from(seen.values());
};

const finalizeAuditState = (state) => {
  for (const type of VALID_PRODUCT_TYPES) {
    const productMap = state.productOccurrencesByType[type];

    for (const [productId, occurrences] of productMap.entries()) {
      const artworks = uniqueArtworkOccurrences(occurrences);

      if (artworks.length <= 1) {
        continue;
      }

      state.crossArtworkDuplicates.push({
        type,
        productId,
        artworkCount: artworks.length,
        linkCount: occurrences.length,
        artworks,
      });
    }
  }

  state.summary.invalidProductIdCount = state.invalidProductIds.length;
  state.summary.unknownProductTypeCount = state.unknownProductTypes.length;
  state.summary.withinArtworkDuplicateCount =
    state.withinArtworkDuplicates.length;
  state.summary.crossArtworkDuplicateCount =
    state.crossArtworkDuplicates.length;

  return {
    summary: state.summary,
    invalidProductIds: state.invalidProductIds,
    unknownProductTypes: state.unknownProductTypes,
    withinArtworkDuplicates: state.withinArtworkDuplicates,
    crossArtworkDuplicates: state.crossArtworkDuplicates,
  };
};

const auditArtworkDocuments = (artworks) => {
  const state = createAuditState();

  artworks.forEach((artwork) => recordArtwork(state, artwork));

  return finalizeAuditState(state);
};

const hasBlockingFindings = (report) => {
  return (
    report.summary.invalidProductIdCount > 0 ||
    report.summary.unknownProductTypeCount > 0
  );
};

const formatAuditReport = (report) => {
  const lines = [
    "Shopify product link audit",
    "",
    "Summary:",
    `- Artworks scanned: ${report.summary.totalArtworksScanned}`,
    `- Artworks with Shopify links: ${report.summary.artworksWithShopifyLinks}`,
    `- Total Shopify links: ${report.summary.totalLinks}`,
    `- Invalid product IDs: ${report.summary.invalidProductIdCount}`,
    `- Unknown product types: ${report.summary.unknownProductTypeCount}`,
    `- Duplicate product IDs within one artwork: ${report.summary.withinArtworkDuplicateCount}`,
    `- Duplicate product IDs across artworks: ${report.summary.crossArtworkDuplicateCount}`,
    "",
  ];

  lines.push("Invalid Product IDs:");
  if (report.invalidProductIds.length === 0) {
    lines.push("- None");
  } else {
    report.invalidProductIds.forEach((finding) => {
      lines.push(
        `- [${finding.artworkId}] ${finding.title} link #${finding.linkIndex}: productId=${stringifyValue(
          finding.productId
        )}, type=${stringifyValue(finding.type)}, reason=${finding.reason}`
      );
    });
  }

  lines.push("", "Unknown Product Types:");
  if (report.unknownProductTypes.length === 0) {
    lines.push("- None");
  } else {
    report.unknownProductTypes.forEach((finding) => {
      lines.push(
        `- [${finding.artworkId}] ${finding.title} link #${finding.linkIndex}: type=${stringifyValue(
          finding.type
        )}, productId=${stringifyValue(finding.productId)}, reason=${finding.reason}`
      );
    });
  }

  lines.push("", "Duplicate Product IDs Within One Artwork:");
  if (report.withinArtworkDuplicates.length === 0) {
    lines.push("- None");
  } else {
    report.withinArtworkDuplicates.forEach((finding) => {
      lines.push(
        `- [${finding.artworkId}] ${finding.title}: productId=${finding.productId}, count=${finding.count}, types=${finding.types
          .map((type) => stringifyValue(type))
          .join(", ")}, linkIndexes=${finding.linkIndexes.join(", ")}`
      );
    });
  }

  lines.push("", "Duplicate Product IDs Across Artworks:");
  if (report.crossArtworkDuplicates.length === 0) {
    lines.push("- None");
  } else {
    report.crossArtworkDuplicates.forEach((finding) => {
      lines.push(
        `- type=${finding.type}, productId=${finding.productId}, artworkCount=${finding.artworkCount}, linkCount=${finding.linkCount}`
      );
      finding.artworks.forEach((artwork) => {
        lines.push(
          `  - [${artwork.artworkId}] ${artwork.title} linkIndexes=${artwork.linkIndexes.join(
            ", "
          )}`
        );
      });
    });
  }

  lines.push(
    "",
    hasBlockingFindings(report)
      ? "Exit status: 1 because invalid product IDs or unknown product types were found."
      : "Exit status: 0 because no invalid product IDs or unknown product types were found."
  );

  return lines.join("\n");
};

module.exports = {
  VALID_PRODUCT_TYPES,
  auditArtworkDocuments,
  classifyShopifyProductId,
  classifyShopifyProductType,
  formatAuditReport,
  hasBlockingFindings,
};
