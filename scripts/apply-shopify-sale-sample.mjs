#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import helpers from "./apply-shopify-sale-sample-helpers.cjs";

const {
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

const applyMongoLinkPublicListing = async ({ report }) => {
  const artworkIds = [
    ...new Set(report.products.map((product) => product.artworkId)),
  ];
  const productsByArtworkId = new Map();

  for (const product of report.products) {
    const current = productsByArtworkId.get(product.artworkId) ?? [];
    current.push(product);
    productsByArtworkId.set(product.artworkId, current);
  }

  const docs = await mongoose.connection.db
    .collection("artworks")
    .find(
      {
        _id: {
          $in: artworkIds.map((artworkId) => new mongoose.Types.ObjectId(artworkId)),
        },
      },
      {
        projection: {
          _id: 1,
          shopifyProducts: 1,
        },
      }
    )
    .toArray();
  const docsById = new Map(docs.map((doc) => [String(doc._id), doc]));

  for (const artworkId of artworkIds) {
    const doc = docsById.get(artworkId);
    const selectedProducts = productsByArtworkId.get(artworkId) ?? [];

    if (!doc) {
      for (const product of selectedProducts) {
        product.mongoAction = "failed";
        product.error = {
          code: "mongodb_artwork_not_found",
          message: "Selected artwork was not found in MongoDB.",
        };
      }
      continue;
    }

    const selectedProductIds = new Set(
      selectedProducts.map((product) => product.productId)
    );
    const existingLinks = Array.isArray(doc.shopifyProducts)
      ? doc.shopifyProducts.map((link) => ({
          productId: String(link?.productId ?? "").trim(),
          type: String(link?.type ?? "").trim(),
          publicListing: link?.publicListing === false ? false : true,
        }))
      : [];
    const foundProductIds = new Set(
      existingLinks
        .filter((link) => selectedProductIds.has(link.productId))
        .map((link) => link.productId)
    );
    const missingProducts = selectedProducts.filter(
      (product) => !foundProductIds.has(product.productId)
    );

    for (const product of missingProducts) {
      product.mongoAction = "failed";
      product.error = {
        code: "mongodb_product_link_not_found",
        message: "Selected product link was not found on the artwork.",
      };
    }

    if (missingProducts.length > 0) {
      continue;
    }

    const desiredLinks = existingLinks.map((link) =>
      selectedProductIds.has(link.productId)
        ? { ...link, publicListing: true }
        : link
    );
    const alreadyPublic = existingLinks.every((link) =>
      selectedProductIds.has(link.productId) ? link.publicListing === true : true
    );

    if (alreadyPublic) {
      for (const product of selectedProducts) {
        product.mongoAction = "already_public";
      }
      continue;
    }

    try {
      const result = await mongoose.connection.db
        .collection("artworks")
        .updateOne(
          { _id: new mongoose.Types.ObjectId(artworkId) },
          { $set: { shopifyProducts: desiredLinks } }
        );

      if (result.matchedCount !== 1) {
        throw new Error("MongoDB update did not match exactly one artwork.");
      }

      for (const product of selectedProducts) {
        product.mongoAction = "updated";
        product.mongoWriteResult = {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          acknowledged: result.acknowledged,
        };
      }
    } catch (error) {
      for (const product of selectedProducts) {
        product.mongoAction = "failed";
        product.error = {
          code: "mongodb_update_failed",
          message: error instanceof Error ? error.message : String(error),
        };
      }
    }
  }

  updateReportSummary(report);
};

const getPublication = async ({ endpoint, token, report, options }) => {
  if (options.publicationId) {
    report.requestedPublication.resolvedPublication = {
      id: options.publicationId,
      name: options.publicationName,
    };
    return report.requestedPublication.resolvedPublication;
  }

  const data = await shopifyAdminFetch({
    endpoint,
    token,
    query: PUBLICATIONS_QUERY,
    variables: {},
  });
  const publication = resolvePublication({
    publications: data?.publications?.nodes,
    publicationId: options.publicationId,
    publicationName: options.publicationName,
  });

  report.requestedPublication.resolvedPublication = publication;
  return publication;
};

const activateProduct = async ({ endpoint, token, product }) => {
  const data = await shopifyAdminFetch({
    endpoint,
    token,
    query: PRODUCT_ACTIVATE_MUTATION,
    variables: createActivateMutationVariables(product.gid),
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

const publishProduct = async ({ endpoint, token, product, publicationId }) => {
  const data = await shopifyAdminFetch({
    endpoint,
    token,
    query: PRODUCT_PUBLISH_MUTATION,
    variables: createPublishMutationVariables({
      shopifyProductGid: product.gid,
      publicationId,
    }),
  });
  const payload = data?.publishablePublish;
  const userErrors = payload?.userErrors ?? [];

  if (userErrors.length > 0) {
    const message = userErrors
      .map((error) => error?.message)
      .filter(Boolean)
      .slice(0, 3)
      .join("; ");

    throw new Error(
      `Shopify publishablePublish user errors${message ? `: ${message}` : ""}`
    );
  }

  return payload?.publishable ?? null;
};

const applyShopifyActivation = async ({
  report,
  endpoint,
  token,
  publication,
  sensitiveValues,
}) => {
  for (const product of report.products) {
    try {
      product.shopifyStatusResponse = await activateProduct({
        endpoint,
        token,
        product,
      });
      product.shopifyStatusAction = "activated";
    } catch (error) {
      product.shopifyStatusAction = "failed";
      product.error = {
        code: "shopify_status_update_failed",
        message: redactSensitiveText(error, sensitiveValues),
      };
      updateReportSummary(report);
      continue;
    }

    try {
      product.shopifyPublishResponse = await publishProduct({
        endpoint,
        token,
        product,
        publicationId: publication.id,
      });
      product.shopifyPublishAction = "published";
    } catch (error) {
      product.shopifyPublishAction = "failed";
      product.error = {
        code: "shopify_publish_failed",
        message: redactSensitiveText(error, sensitiveValues),
      };
    }

    updateReportSummary(report);
  }
};

let exitCode = 0;
const sensitiveValues = [process.env.SHOPIFY_ADMIN_ACCESS_TOKEN];

try {
  const options = parseArgs(process.argv.slice(2));
  const [{ resolvedInputPath, data: selection }, resolvedOutputPath] =
    await Promise.all([
      readJsonFile(options.selection),
      ensureReportPathWritable(options.output),
    ]);
  const report = buildActivationReport({
    selection,
    options,
    source: {
      selectionInputPath: options.selection,
      selectionResolvedInputPath: resolvedInputPath,
      outputPath: options.output,
    },
  });

  if (options.mode === "write") {
    const mongoEnv = validateMongoEnv(process.env);
    const shopifyEnv = validateRequiredEnv(process.env);
    const endpoint = createAdminGraphqlUrl(shopifyEnv);

    await mongoose.connect(mongoEnv.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    try {
      const publication = await getPublication({
        endpoint,
        token: shopifyEnv.adminAccessToken,
        report,
        options,
      });

      await applyMongoLinkPublicListing({ report });
      await applyShopifyActivation({
        report,
        endpoint,
        token: shopifyEnv.adminAccessToken,
        publication,
        sensitiveValues: [shopifyEnv.adminAccessToken],
      });
    } catch (error) {
      report.requestedPublication.resolutionError = {
        code: "shopify_publication_resolution_failed",
        message: redactSensitiveText(error, sensitiveValues),
      };
      updateReportSummary(report);
    }
  }

  await writeJsonReport(options.output, report);

  console.log("Shopify sale sample activation report written.");
  console.log(`Selection: ${resolvedInputPath}`);
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Mode: ${options.mode}`);
  console.log(`Selected originals: ${report.summary.selectedOriginals}`);
  console.log(`Selected prints: ${report.summary.selectedPrints}`);
  console.log(`Mongo updated: ${report.summary.mongoUpdated}`);
  console.log(`Mongo already public: ${report.summary.mongoAlreadyMatched}`);
  console.log(`Shopify activated: ${report.summary.shopifyStatusUpdated}`);
  console.log(`Shopify published: ${report.summary.shopifyPublished}`);

  exitCode = hasActivationFailures(report) ? 1 : 0;
} catch (error) {
  exitCode = 1;
  console.error("Shopify sale sample activation failed.");
  console.error(redactSensitiveText(error, sensitiveValues));
} finally {
  await mongoose.disconnect().catch((disconnectError) => {
    exitCode = 1;
    console.error("Failed to disconnect from MongoDB.");
    console.error(redactSensitiveText(disconnectError, sensitiveValues));
  });
}

process.exitCode = exitCode;
