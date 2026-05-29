#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import helpers from "./plan-framed-print-variants-helpers.cjs";

const {
  DEFAULT_FORMULA_INPUT_PATH,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_SELECTION_INPUT_PATH,
  buildFramedPrintVariantPlan,
  createAdminGraphqlUrl,
  hasReadFailures,
  normalizeShopifyProductState,
  parseArgs,
  redactPlanError,
  toShopifyProductGid,
  validateRequiredEnv,
} = helpers;

const PRODUCT_VARIANT_STATE_QUERY = `
  query FramedPrintVariantPlanProduct($id: ID!) {
    product(id: $id) {
      id
      legacyResourceId
      handle
      title
      productType
      status
      publishedAt
      tags
      totalInventory
      options {
        id
        name
        position
        values
      }
      variants(first: 100) {
        nodes {
          id
          legacyResourceId
          title
          price
          inventoryQuantity
          inventoryPolicy
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

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

const createSelectedPrintGids = (selection) =>
  Array.from(
    new Set(
      (selection.selectedProducts ?? [])
        .filter((product) => product?.productFamily === "print")
        .map(toShopifyProductGid)
        .filter(Boolean)
    )
  );

const readCurrentProductState = async ({
  endpoint,
  token,
  productGid,
  sensitiveValues,
}) => {
  try {
    const data = await shopifyAdminFetch({
      endpoint,
      token,
      query: PRODUCT_VARIANT_STATE_QUERY,
      variables: { id: productGid },
    });

    return {
      product: data?.product ?? null,
      error: null,
    };
  } catch (error) {
    return {
      product: null,
      error: { message: redactPlanError(error, sensitiveValues) },
    };
  }
};

const readCurrentProductLookup = async ({ selection, endpoint, token }) => {
  const sensitiveValues = [token];
  const lookup = new Map();

  for (const productGid of createSelectedPrintGids(selection)) {
    lookup.set(
      productGid,
      await readCurrentProductState({
        endpoint,
        token,
        productGid,
        sensitiveValues,
      })
    );
  }

  return lookup;
};

let exitCode = 0;
const sensitiveValues = [process.env.SHOPIFY_ADMIN_ACCESS_TOKEN];

try {
  const args = parseArgs(process.argv.slice(2));
  const formulaInputPath = args.input ?? DEFAULT_FORMULA_INPUT_PATH;
  const selectionInputPath = args.selection ?? DEFAULT_SELECTION_INPUT_PATH;
  const outputPath = args.output ?? DEFAULT_OUTPUT_PATH;
  const env = validateRequiredEnv(process.env);
  const [
    { resolvedInputPath: resolvedFormulaPath, data: formulaAudit },
    { resolvedInputPath: resolvedSelectionPath, data: selection },
  ] = await Promise.all([
    readJsonFile(formulaInputPath),
    readJsonFile(selectionInputPath),
  ]);
  const endpoint = createAdminGraphqlUrl(env);
  const productLookup = await readCurrentProductLookup({
    selection,
    endpoint,
    token: env.adminAccessToken,
  });
  const report = buildFramedPrintVariantPlan({
    formulaAudit,
    selection,
    productLookup,
    shopDomain: env.shopDomain,
    source: {
      formulaInputPath,
      formulaResolvedInputPath: resolvedFormulaPath,
      selectionInputPath,
      selectionResolvedInputPath: resolvedSelectionPath,
      outputPath,
      shopDomain: env.shopDomain,
      adminApiVersion: env.adminApiVersion,
    },
  });
  const resolvedOutputPath = await writeJsonReport(outputPath, report);

  console.log("Read-only framed print variant plan written.");
  console.log(`Formula input: ${resolvedFormulaPath}`);
  console.log(`Selection input: ${resolvedSelectionPath}`);
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Sale-sample print products: ${report.summary.selectedPrintProducts}`);
  console.log(`Target variant rows: ${report.summary.targetVariantRows}`);
  console.log(
    `Preserve: ${report.summary.preserveExistingVariant}; create missing: ${report.summary.createMissingVariant}; future price update: ${report.summary.updatePriceInFutureWrite}; manual review: ${report.summary.manualReview}`
  );
  console.log(`Shopify read errors: ${report.summary.queryErrorCount}`);

  exitCode = hasReadFailures(report) ? 1 : 0;
} catch (error) {
  exitCode = 1;
  console.error("Read-only framed print variant planning failed.");
  console.error(redactPlanError(error, sensitiveValues));
}

process.exitCode = exitCode;

export { PRODUCT_VARIANT_STATE_QUERY, normalizeShopifyProductState };
