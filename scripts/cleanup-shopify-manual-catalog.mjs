#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import helpers from "./cleanup-shopify-manual-catalog-helpers.cjs";

const {
  DEFAULT_CLEANUP_OUTPUT_PATH,
  DEFAULT_RECONCILIATION_INPUT_PATH,
  PRODUCT_ARCHIVE_MUTATION,
  buildCleanupReport,
  createAdminGraphqlUrl,
  createArchiveMutationVariables,
  hasBlockingCleanupValidation,
  hasCleanupExecutionFailures,
  parseArgs,
  redactSensitiveText,
  summarizeProductEntries,
  validateExecutionOptions,
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

const archiveProduct = async ({ endpoint, token, shopifyProductId }) => {
  const data = await shopifyAdminFetch({
    endpoint,
    token,
    query: PRODUCT_ARCHIVE_MUTATION,
    variables: createArchiveMutationVariables(shopifyProductId),
  });
  const payload = data?.productUpdate;
  const userErrors = payload?.userErrors ?? [];

  if (userErrors.length > 0) {
    const message = userErrors
      .map((error) => error?.message)
      .filter(Boolean)
      .slice(0, 3)
      .join("; ");

    throw new Error(
      `Shopify productUpdate user errors${message ? `: ${message}` : ""}`
    );
  }

  return payload?.product ?? null;
};

const applyArchiveMode = async ({ report, endpoint, token, sensitiveValues }) => {
  for (const product of report.products) {
    if (product.action !== "archive_product") {
      continue;
    }

    try {
      product.shopifyResponse = await archiveProduct({
        endpoint,
        token,
        shopifyProductId: product.shopifyProductId,
      });
      product.action = "archived";
    } catch (error) {
      product.action = "archive_failed";
      product.error = {
        code: "shopify_archive_failed",
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
  const input =
    args.reconciliation ?? DEFAULT_RECONCILIATION_INPUT_PATH;
  const output = args.output ?? DEFAULT_CLEANUP_OUTPUT_PATH;
  const { resolvedInputPath, data } = await readJsonFile(input);
  let report = buildCleanupReport({
    reconciliationReport: data,
    reconciliationInputPath: input,
    outputPath: output,
    mode: args.mode,
  });

  if (hasBlockingCleanupValidation(report)) {
    const resolvedOutputPath = await writeJsonReport(output, report);
    console.error("Shopify manual product cleanup validation failed.");
    console.error(`Report: ${resolvedOutputPath}`);
    exitCode = 1;
  } else if (args.mode === "archive") {
    const env = validateRequiredEnv(process.env);
    const endpoint = createAdminGraphqlUrl(env);
    report = await applyArchiveMode({
      report,
      endpoint,
      token: env.adminAccessToken,
      sensitiveValues: [env.adminAccessToken],
    });
    const resolvedOutputPath = await writeJsonReport(output, report);

    console.log("Shopify manual product cleanup archive report written.");
    console.log(`Input: ${resolvedInputPath}`);
    console.log(`Output: ${resolvedOutputPath}`);
    console.log(`Products archived: ${report.summary.archiveSucceeded}`);
    console.log(`Archive failures: ${report.summary.archiveFailed}`);

    exitCode = hasCleanupExecutionFailures(report) ? 1 : 0;
  } else {
    const resolvedOutputPath = await writeJsonReport(output, report);

    console.log("Shopify manual product cleanup dry-run report written.");
    console.log(`Input: ${resolvedInputPath}`);
    console.log(`Output: ${resolvedOutputPath}`);
    console.log(`Products that would be archived: ${report.summary.productsTargeted}`);

    exitCode = 0;
  }
} catch (error) {
  exitCode = 1;
  console.error("Shopify manual product cleanup failed.");
  console.error(redactSensitiveText(error, sensitiveValues));
}

process.exitCode = exitCode;
