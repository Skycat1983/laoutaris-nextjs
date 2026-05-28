#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import helpers from "./reconcile-shopify-catalog-plan-helpers.cjs";

const {
  DEFAULT_PLAN_INPUT_PATH,
  DEFAULT_RECONCILIATION_OUTPUT_PATH,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_BY_ARTWORK_METAFIELD_QUERY,
  PRODUCTS_BY_MANUAL_ARTWORK_NUMBER_QUERY,
  buildManualArtworkNumberSearchQuery,
  buildMetafieldSearchQuery,
  buildReconciliationReport,
  createAdminGraphqlUrl,
  getArtworkNumberFromTitle,
  hasBlockingReconciliationFindings,
  normalizeShopifyProduct,
  parseArgs,
  redactSensitiveText,
  validatePlanInput,
  validateRequiredEnv,
} = helpers;

const readJsonFile = async (inputPath) => {
  const resolvedInputPath = path.resolve(process.cwd(), inputPath);
  const content = await fs.readFile(resolvedInputPath, "utf8");
  return {
    resolvedInputPath,
    data: JSON.parse(content),
  };
};

const writeJsonReport = async (outputPath, report) => {
  const resolvedOutputPath = path.resolve(process.cwd(), outputPath);
  await fs.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
  await fs.writeFile(
    resolvedOutputPath,
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  );
  return resolvedOutputPath;
};

const shopifyAdminFetch = async ({ endpoint, token, query, variables }) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `Shopify Admin GraphQL HTTP ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();

  if (Array.isArray(json.errors) && json.errors.length > 0) {
    const messages = json.errors
      .map((error) => error?.message)
      .filter(Boolean)
      .slice(0, 3)
      .join("; ");

    throw new Error(
      `Shopify Admin GraphQL errors${messages ? `: ${messages}` : ""}`
    );
  }

  return json.data;
};

const toSafeLookupError = (error, sensitiveValues) => ({
  message: redactSensitiveText(error, sensitiveValues),
});

const lookupProductByHandle = async ({
  endpoint,
  token,
  handle,
  shopDomain,
  sensitiveValues,
}) => {
  try {
    const data = await shopifyAdminFetch({
      endpoint,
      token,
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    });

    return {
      product: normalizeShopifyProduct(data?.productByHandle, { shopDomain }),
    };
  } catch (error) {
    return {
      product: null,
      error: toSafeLookupError(error, sensitiveValues),
    };
  }
};

const lookupProductsByArtworkMetafield = async ({
  endpoint,
  token,
  artworkId,
  shopDomain,
  sensitiveValues,
}) => {
  try {
    const data = await shopifyAdminFetch({
      endpoint,
      token,
      query: PRODUCTS_BY_ARTWORK_METAFIELD_QUERY,
      variables: { query: buildMetafieldSearchQuery(artworkId) },
    });
    const products = (data?.products?.edges ?? [])
      .map((edge) => edge?.node)
      .filter(Boolean)
      .map((product) => normalizeShopifyProduct(product, { shopDomain }));

    return { products };
  } catch (error) {
    return {
      products: [],
      error: toSafeLookupError(error, sensitiveValues),
    };
  }
};

const lookupProductsByManualArtworkNumber = async ({
  endpoint,
  token,
  artworkNumber,
  shopDomain,
  sensitiveValues,
}) => {
  try {
    const data = await shopifyAdminFetch({
      endpoint,
      token,
      query: PRODUCTS_BY_MANUAL_ARTWORK_NUMBER_QUERY,
      variables: { query: buildManualArtworkNumberSearchQuery(artworkNumber) },
    });
    const products = (data?.products?.edges ?? [])
      .map((edge) => edge?.node)
      .filter(Boolean)
      .map((product) => normalizeShopifyProduct(product, { shopDomain }));

    return { products };
  } catch (error) {
    return {
      products: [],
      error: toSafeLookupError(error, sensitiveValues),
    };
  }
};

const runLookups = async ({ plan, endpoint, token, shopDomain }) => {
  const handles = Array.from(
    new Set(
      plan.artworks.flatMap((artwork) =>
        artwork.products.map((product) => product.proposedHandle)
      )
    )
  );
  const artworkIds = Array.from(
    new Set(plan.artworks.map((artwork) => artwork.customMongodbArtworkId))
  );
  const sensitiveValues = [token];
  const handleLookups = {};
  const metafieldLookups = {};
  const manualNumberLookups = {};
  const manualNumberLookupCache = {};

  for (const handle of handles) {
    handleLookups[handle] = await lookupProductByHandle({
      endpoint,
      token,
      handle,
      shopDomain,
      sensitiveValues,
    });
  }

  for (const artworkId of artworkIds) {
    metafieldLookups[artworkId] = await lookupProductsByArtworkMetafield({
      endpoint,
      token,
      artworkId,
      shopDomain,
      sensitiveValues,
    });
  }

  for (const artwork of plan.artworks) {
    const artworkNumber = getArtworkNumberFromTitle(artwork.title);
    const artworkId = artwork.customMongodbArtworkId;

    if (!artworkNumber) {
      manualNumberLookups[artworkId] = { products: [] };
      continue;
    }

    if (!manualNumberLookupCache[artworkNumber.normalized]) {
      manualNumberLookupCache[artworkNumber.normalized] =
        await lookupProductsByManualArtworkNumber({
          endpoint,
          token,
          artworkNumber,
          shopDomain,
          sensitiveValues,
        });
    }

    manualNumberLookups[artworkId] =
      manualNumberLookupCache[artworkNumber.normalized];
  }

  return {
    handleLookups,
    metafieldLookups,
    manualNumberLookups,
  };
};

let exitCode = 0;
const sensitiveValues = [process.env.SHOPIFY_ADMIN_ACCESS_TOKEN];

try {
  const env = validateRequiredEnv(process.env);
  const args = parseArgs(process.argv.slice(2));
  const input = args.input ?? DEFAULT_PLAN_INPUT_PATH;
  const output = args.output ?? DEFAULT_RECONCILIATION_OUTPUT_PATH;
  const { resolvedInputPath, data } = await readJsonFile(input);
  const plan = validatePlanInput(data);
  const endpoint = createAdminGraphqlUrl(env);
  const { handleLookups, metafieldLookups, manualNumberLookups } =
    await runLookups({
      plan,
      endpoint,
      token: env.adminAccessToken,
      shopDomain: env.shopDomain,
    });
  const report = buildReconciliationReport({
    plan,
    handleLookups,
    metafieldLookups,
    manualNumberLookups,
    source: {
      planInputPath: input,
      shopDomain: env.shopDomain,
      adminApiVersion: env.adminApiVersion,
    },
  });
  const resolvedOutputPath = await writeJsonReport(output, report);

  console.log("Read-only Shopify catalog reconciliation report written.");
  console.log(`Input: ${resolvedInputPath}`);
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Artworks scanned: ${report.summary.artworksScanned}`);
  console.log(`Planned products scanned: ${report.summary.plannedProductsScanned}`);
  console.log(
    `Matches: ${report.summary.plannedProductsWithExactMatch} exact, ${report.summary.plannedProductsWithHandleOnlyMatch} handle-only, ${report.summary.plannedProductsWithMetafieldOnlyMatch} metafield-only, ${report.summary.plannedProductsWithManualProductMatch} manual, ${report.summary.plannedProductsWithNoMatch} no match`
  );
  console.log(
    `Review blockers: ${report.summary.plannedProductsWithConflict} conflicts, ${report.summary.queryErrorCount} query errors`
  );

  exitCode = hasBlockingReconciliationFindings(report) ? 1 : 0;
} catch (error) {
  exitCode = 1;
  console.error("Read-only Shopify catalog reconciliation failed.");
  console.error(redactSensitiveText(error, sensitiveValues));
}

process.exitCode = exitCode;
