#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import helpers from "./cleanup-shopify-clean-slate-catalog-helpers.cjs";

const {
  DEFAULT_CLEAN_SLATE_OUTPUT_PATH,
  PRODUCT_DELETE_MUTATION,
  SHOPIFY_PRODUCTS_QUERY,
  buildCleanSlateReport,
  createAdminGraphqlUrl,
  createDeleteMutationVariables,
  hasBlockingCleanSlateValidation,
  hasCleanSlateExecutionFailures,
  normalizeShopifyProduct,
  parseArgs,
  redactSensitiveText,
  summarizeProductEntries,
  validateExecutionOptions,
  validateRequiredEnv,
} = helpers;

const PRODUCTS_PAGE_SIZE = 100;

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

const fetchAllProducts = async ({ endpoint, token, shopDomain }) => {
  const products = [];
  let after = null;
  let productPagesRead = 0;

  do {
    const data = await shopifyAdminFetch({
      endpoint,
      token,
      query: SHOPIFY_PRODUCTS_QUERY,
      variables: {
        first: PRODUCTS_PAGE_SIZE,
        after,
      },
    });
    const connection = data?.products;
    const pageProducts = (connection?.edges ?? [])
      .map((edge) => edge?.node)
      .filter(Boolean)
      .map((product) => normalizeShopifyProduct(product, { shopDomain }));

    products.push(...pageProducts);
    productPagesRead += 1;
    after = connection?.pageInfo?.hasNextPage
      ? connection.pageInfo.endCursor
      : null;
  } while (after);

  return {
    products,
    productPagesRead,
  };
};

const deleteProduct = async ({ endpoint, token, shopifyProductId }) => {
  const data = await shopifyAdminFetch({
    endpoint,
    token,
    query: PRODUCT_DELETE_MUTATION,
    variables: createDeleteMutationVariables(shopifyProductId),
  });
  const payload = data?.productDelete;
  const userErrors = payload?.userErrors ?? [];

  if (userErrors.length > 0) {
    const message = userErrors
      .map((error) => error?.message)
      .filter(Boolean)
      .slice(0, 3)
      .join("; ");

    throw new Error(
      `Shopify productDelete user errors${message ? `: ${message}` : ""}`
    );
  }

  return {
    deletedProductId: payload?.deletedProductId ?? null,
  };
};

const applyDeleteMode = async ({ report, endpoint, token, sensitiveValues }) => {
  for (const product of report.products) {
    if (product.action !== "delete_product") {
      continue;
    }

    try {
      product.shopifyResponse = await deleteProduct({
        endpoint,
        token,
        shopifyProductId: product.shopifyProductId,
      });
      product.action = "deleted";
    } catch (error) {
      product.action = "delete_failed";
      product.error = {
        code: "shopify_delete_failed",
        message: redactSensitiveText(error, sensitiveValues),
      };
    }
  }

  report.summary = summarizeProductEntries(report.products);
  return report;
};

let exitCode = 0;
const sensitiveValues = [process.env.SHOPIFY_ADMIN_ACCESS_TOKEN];

try {
  const args = validateExecutionOptions(parseArgs(process.argv.slice(2)));
  const output = args.output ?? DEFAULT_CLEAN_SLATE_OUTPUT_PATH;
  const env = validateRequiredEnv(process.env);
  const endpoint = createAdminGraphqlUrl(env);
  const { products, productPagesRead } = await fetchAllProducts({
    endpoint,
    token: env.adminAccessToken,
    shopDomain: env.shopDomain,
  });
  let report = buildCleanSlateReport({
    products,
    outputPath: output,
    mode: args.mode,
    source: {
      shopDomain: env.shopDomain,
      adminApiVersion: env.adminApiVersion,
      productPagesRead,
    },
  });

  if (hasBlockingCleanSlateValidation(report)) {
    const resolvedOutputPath = await writeJsonReport(output, report);
    console.error("Shopify clean-slate catalog cleanup validation failed.");
    console.error(`Report: ${resolvedOutputPath}`);
    exitCode = 1;
  } else if (args.mode === "delete") {
    report = await applyDeleteMode({
      report,
      endpoint,
      token: env.adminAccessToken,
      sensitiveValues: [env.adminAccessToken],
    });
    const resolvedOutputPath = await writeJsonReport(output, report);

    console.log("Shopify clean-slate catalog deletion report written.");
    console.log(`Output: ${resolvedOutputPath}`);
    console.log(`Products deleted: ${report.summary.deleteSucceeded}`);
    console.log(`Delete failures: ${report.summary.deleteFailed}`);

    exitCode = hasCleanSlateExecutionFailures(report) ? 1 : 0;
  } else {
    const resolvedOutputPath = await writeJsonReport(output, report);

    console.log("Shopify clean-slate catalog dry-run report written.");
    console.log(`Output: ${resolvedOutputPath}`);
    console.log(`Products scanned: ${report.summary.productsScanned}`);
    console.log(
      `Book/publication products kept: ${report.summary.bookPublicationProductsKept}`
    );
    console.log(
      `Non-book products that would be deleted: ${report.summary.nonBookDeleteCandidates}`
    );

    exitCode = 0;
  }
} catch (error) {
  exitCode = 1;
  console.error("Shopify clean-slate catalog cleanup failed.");
  console.error(redactSensitiveText(error, sensitiveValues));
}

process.exitCode = exitCode;
