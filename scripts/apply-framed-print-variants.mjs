#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import helpers from "./apply-framed-print-variants-helpers.cjs";

const {
  DEFAULT_OUTPUT_PATH,
  DEFAULT_PLAN_INPUT_PATH,
  FRAME_PACKAGE_OPTION_NAME,
  MAT_OPTION_NAME,
  buildFramedPrintVariantWriteReport,
  createAdminGraphqlUrl,
  parseArgs,
  redactWriteError,
  validateRequiredEnv,
} = helpers;

const PRODUCT_OPTIONS_CREATE_MUTATION = `
  mutation CreateFramedPrintMatOption(
    $productId: ID!
    $options: [OptionCreateInput!]!
    $variantStrategy: ProductOptionCreateVariantStrategy
  ) {
    productOptionsCreate(
      productId: $productId
      options: $options
      variantStrategy: $variantStrategy
    ) {
      product {
        id
        options {
          id
          name
          values
          position
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const PRODUCT_VARIANTS_BULK_CREATE_MUTATION = `
  mutation CreateFramedPrintVariants(
    $productId: ID!
    $variants: [ProductVariantsBulkInput!]!
  ) {
    productVariantsBulkCreate(productId: $productId, variants: $variants) {
      product {
        id
        options {
          id
          name
          values
          position
        }
      }
      productVariants {
        id
        legacyResourceId
        title
        price
        inventoryPolicy
        selectedOptions {
          name
          value
        }
      }
      userErrors {
        field
        message
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

const assertNoUserErrors = (payload, pathName) => {
  const userErrors = payload?.userErrors ?? [];

  if (userErrors.length > 0) {
    const messages = userErrors
      .map((error) => error?.message)
      .filter(Boolean)
      .join("; ");

    throw new Error(`${pathName} returned user errors: ${messages}`);
  }
};

const findOptionId = (product, optionName) =>
  (product?.options ?? []).find((option) => option?.name === optionName)?.id ??
  null;

const ensureMatOption = async ({ endpoint, token, productPlan }) => {
  if (!productPlan.optionMutation) {
    return {
      product: null,
      matOptionId:
        productPlan.createVariantTargets[0]?.mutationInput?.optionValues?.find(
          (option) => option.name === productPlan.createVariantTargets[0].mat
        )?.optionId ?? null,
      operation: "preserved_existing_mat_option",
    };
  }

  const data = await shopifyAdminFetch({
    endpoint,
    token,
    query: PRODUCT_OPTIONS_CREATE_MUTATION,
    variables: {
      productId: productPlan.productId,
      options: productPlan.optionMutation.options,
      variantStrategy: "LEAVE_AS_IS",
    },
  });
  const payload = data?.productOptionsCreate;
  assertNoUserErrors(payload, "productOptionsCreate");

  return {
    product: payload?.product ?? null,
    matOptionId: findOptionId(payload?.product, MAT_OPTION_NAME),
    operation: "created_mat_option",
  };
};

const createVariantMutationInputs = ({ productPlan, matOptionId }) => {
  if (!matOptionId) {
    throw new Error(`Product ${productPlan.productId} lacks a Mat option ID.`);
  }

  return productPlan.createVariantTargets.map((target) => {
    const frameOptionValue = target.mutationInput.optionValues.find(
      (option) => option.name === target.framePackage
    );

    if (!frameOptionValue?.optionId) {
      throw new Error(
        `Product ${productPlan.productId} lacks a Frame package option ID.`
      );
    }

    return {
      price: target.expectedPrice,
      inventoryPolicy: "DENY",
      optionValues: [
        {
          name: target.framePackage,
          optionId: frameOptionValue.optionId,
        },
        {
          name: target.mat,
          optionId: matOptionId,
        },
      ],
    };
  });
};

const createProductVariants = async ({
  endpoint,
  token,
  productPlan,
  matOptionId,
}) => {
  const variants = createVariantMutationInputs({ productPlan, matOptionId });
  const data = await shopifyAdminFetch({
    endpoint,
    token,
    query: PRODUCT_VARIANTS_BULK_CREATE_MUTATION,
    variables: {
      productId: productPlan.productId,
      variants,
    },
  });
  const payload = data?.productVariantsBulkCreate;
  assertNoUserErrors(payload, "productVariantsBulkCreate");

  return {
    requestedVariants: variants,
    createdVariants: payload?.productVariants ?? [],
    product: payload?.product ?? null,
  };
};

const executeWrites = async ({ report, endpoint, token, sensitiveValues }) => {
  const results = [];

  for (const productPlan of report.products) {
    try {
      const optionResult = await ensureMatOption({
        endpoint,
        token,
        productPlan,
      });
      const variantResult = await createProductVariants({
        endpoint,
        token,
        productPlan,
        matOptionId: optionResult.matOptionId,
      });

      results.push({
        status: "created",
        productId: productPlan.productId,
        legacyResourceId: productPlan.legacyResourceId,
        handle: productPlan.handle,
        optionOperation: optionResult.operation,
        requestedVariantCount: variantResult.requestedVariants.length,
        createdVariantCount: variantResult.createdVariants.length,
        createdVariants: variantResult.createdVariants,
      });
    } catch (error) {
      results.push({
        status: "failed",
        productId: productPlan.productId,
        legacyResourceId: productPlan.legacyResourceId,
        handle: productPlan.handle,
        error: redactWriteError(error, sensitiveValues),
      });
      break;
    }
  }

  return results;
};

let exitCode = 0;
const sensitiveValues = [process.env.SHOPIFY_ADMIN_ACCESS_TOKEN];

try {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input ?? DEFAULT_PLAN_INPUT_PATH;
  const outputPath = args.output ?? DEFAULT_OUTPUT_PATH;
  const { resolvedInputPath, data: variantPlan } = await readJsonFile(inputPath);
  const source = {
    inputPath,
    inputResolvedPath: resolvedInputPath,
    outputPath,
  };
  const initialReport = buildFramedPrintVariantWriteReport({
    plan: variantPlan,
    options: args,
    source,
  });
  let finalReport = initialReport;

  if (args.mode === "write") {
    const env = validateRequiredEnv(process.env);
    const endpoint = createAdminGraphqlUrl(env);
    const writeResults = await executeWrites({
      report: initialReport,
      endpoint,
      token: env.adminAccessToken,
      sensitiveValues,
    });

    finalReport = buildFramedPrintVariantWriteReport({
      plan: variantPlan,
      options: args,
      source: {
        ...source,
        shopDomain: env.shopDomain,
        adminApiVersion: env.adminApiVersion,
      },
      writeResults,
    });
  }

  const resolvedOutputPath = await writeJsonReport(outputPath, finalReport);

  console.log("Framed print variant write report written.");
  console.log(`Input: ${resolvedInputPath}`);
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Mode: ${finalReport.safety.requestedMode}`);
  console.log(`Products planned: ${finalReport.summary.productsPlanned}`);
  console.log(`Variants to create: ${finalReport.summary.variantsToCreate}`);
  console.log(
    `Option create mutations planned: ${finalReport.summary.optionCreateMutationsPlanned}`
  );
  console.log(`Write failures: ${finalReport.summary.writeFailures}`);

  exitCode = finalReport.summary.writeFailures > 0 ? 1 : 0;
} catch (error) {
  exitCode = 1;
  console.error("Framed print variant write command failed.");
  console.error(redactWriteError(error, sensitiveValues));
}

process.exitCode = exitCode;
