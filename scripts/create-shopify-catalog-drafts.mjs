#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import helpers from "./create-shopify-catalog-drafts-helpers.cjs";

const {
  DEFAULT_APPROVAL_INPUT_PATH,
  DEFAULT_DRAFT_OUTPUT_PATH,
  DEFAULT_PLAN_INPUT_PATH,
  DEFAULT_RECONCILIATION_INPUT_PATH,
  PRODUCT_SET_MUTATION,
  applyProductSetFailure,
  applyProductSetSuccess,
  buildDraftCreateReport,
  createAdminGraphqlUrl,
  hasDraftCreateFailures,
  markRemainingProductsSkipped,
  parseArgs,
  redactSensitiveText,
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

const ensureReportPathWritable = async (outputPath) => {
  const resolvedOutputPath = path.resolve(process.cwd(), outputPath);
  const tempPath = `${resolvedOutputPath}.tmp-${process.pid}`;

  await fs.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
  await fs.writeFile(tempPath, "", "utf8");
  await fs.unlink(tempPath);

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

const createDraftProduct = async ({ endpoint, token, variables }) => {
  const data = await shopifyAdminFetch({
    endpoint,
    token,
    query: PRODUCT_SET_MUTATION,
    variables,
  });

  return data?.productSet ?? null;
};

let exitCode = 0;
const sensitiveValues = [process.env.SHOPIFY_ADMIN_ACCESS_TOKEN];

try {
  const args = validateExecutionOptions(parseArgs(process.argv.slice(2)));
  const env = validateRequiredEnv(process.env);
  const planInputPath = args.plan ?? DEFAULT_PLAN_INPUT_PATH;
  const reconciliationInputPath =
    args.reconciliation ?? DEFAULT_RECONCILIATION_INPUT_PATH;
  const approvalInputPath = args.approval ?? DEFAULT_APPROVAL_INPUT_PATH;
  const outputPath = args.output ?? DEFAULT_DRAFT_OUTPUT_PATH;
  const [
    { resolvedInputPath: resolvedPlanPath, data: plan },
    { resolvedInputPath: resolvedReconciliationPath, data: reconciliation },
    { resolvedInputPath: resolvedApprovalPath, data: approval },
  ] = await Promise.all([
    readJsonFile(planInputPath),
    readJsonFile(reconciliationInputPath),
    readJsonFile(approvalInputPath),
  ]);
  const resolvedOutputPath = await ensureReportPathWritable(outputPath);
  const endpoint = createAdminGraphqlUrl(env);
  const report = buildDraftCreateReport({
    plan,
    reconciliation,
    approval,
    source: {
      planInputPath,
      reconciliationInputPath,
      approvalInputPath,
      outputPath,
      shopDomain: env.shopDomain,
      adminApiVersion: env.adminApiVersion,
    },
  });

  for (let index = 0; index < report.products.length; index += 1) {
    const product = report.products[index];

    try {
      const payload = await createDraftProduct({
        endpoint,
        token: env.adminAccessToken,
        variables: product.shopifyMutation.variables,
      });
      const succeeded = applyProductSetSuccess({
        report,
        productIndex: index,
        payload,
        shopDomain: env.shopDomain,
      });

      if (!succeeded) {
        markRemainingProductsSkipped(report, index + 1);
        break;
      }
    } catch (error) {
      applyProductSetFailure({
        report,
        productIndex: index,
        error,
        sensitiveValues: [env.adminAccessToken],
      });
      markRemainingProductsSkipped(report, index + 1);
      break;
    }
  }

  await writeJsonReport(outputPath, report);

  console.log("Shopify full catalog draft creation report written.");
  console.log(`Plan: ${resolvedPlanPath}`);
  console.log(`Reconciliation: ${resolvedReconciliationPath}`);
  console.log(`Approval: ${resolvedApprovalPath}`);
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Products created: ${report.summary.productsCreated}`);
  console.log(`Products failed: ${report.summary.productsFailed}`);
  console.log(`Products skipped: ${report.summary.productsSkipped}`);

  exitCode = hasDraftCreateFailures(report) ? 1 : 0;
} catch (error) {
  exitCode = 1;
  console.error("Shopify full catalog draft creation failed.");
  console.error(redactSensitiveText(error, sensitiveValues));
}

process.exitCode = exitCode;
