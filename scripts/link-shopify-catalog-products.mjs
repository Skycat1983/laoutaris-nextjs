#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import helpers from "./link-shopify-catalog-products-helpers.cjs";

const {
  DEFAULT_LINK_PLAN_OUTPUT_PATH,
  DEFAULT_LINK_WRITE_OUTPUT_PATH,
  DEFAULT_RECONCILIATION_INPUT_PATH,
  applyMongoWriteFailure,
  applyMongoWriteSuccess,
  buildMongoLinkPlan,
  hasMongoWriteFailures,
  parseArgs,
  validateExecutionOptions,
  validateMongoEnv,
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

const getMongoArtworks = async () => {
  const artworks = await mongoose.connection.db
    .collection("artworks")
    .find(
      {},
      {
        projection: {
          _id: 1,
          title: 1,
          shopifyProducts: 1,
        },
      }
    )
    .toArray();

  return artworks.map((artwork) => ({
    ...artwork,
    _id: String(artwork._id),
  }));
};

const writeArtworkLinks = async (report) => {
  for (const artwork of report.artworks) {
    if (artwork.action === "already_linked") {
      continue;
    }

    try {
      const result = await mongoose.connection.db
        .collection("artworks")
        .updateOne(
          { _id: new mongoose.Types.ObjectId(artwork.artworkId) },
          { $set: { shopifyProducts: artwork.desiredShopifyProducts } }
        );

      if (result.matchedCount !== 1) {
        throw new Error("MongoDB update did not match exactly one artwork.");
      }

      applyMongoWriteSuccess({
        report,
        artworkId: artwork.artworkId,
        result,
      });
    } catch (error) {
      applyMongoWriteFailure({
        report,
        artworkId: artwork.artworkId,
        error,
      });
      break;
    }
  }
};

let exitCode = 0;

try {
  const args = validateExecutionOptions(parseArgs(process.argv.slice(2)));
  const env = validateMongoEnv(process.env);
  const reconciliationInputPath =
    args.reconciliation ?? DEFAULT_RECONCILIATION_INPUT_PATH;
  const outputPath =
    args.output ??
    (args.mode === "write"
      ? DEFAULT_LINK_WRITE_OUTPUT_PATH
      : DEFAULT_LINK_PLAN_OUTPUT_PATH);
  const { resolvedInputPath, data: reconciliation } = await readJsonFile(
    reconciliationInputPath
  );

  await ensureReportPathWritable(outputPath);
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  const artworks = await getMongoArtworks();
  const report = buildMongoLinkPlan({
    reconciliation,
    artworks,
    source: {
      reconciliationInputPath,
      outputPath,
    },
    mode: args.mode,
    confirmation: args.confirm,
  });

  if (args.mode === "write") {
    await writeArtworkLinks(report);
  }

  const resolvedOutputPath = await writeJsonReport(outputPath, report);

  console.log(
    args.mode === "write"
      ? "Shopify catalog MongoDB link write report written."
      : "Shopify catalog MongoDB link plan written."
  );
  console.log(`Reconciliation: ${resolvedInputPath}`);
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Artworks scanned: ${report.summary.artworksScanned}`);
  console.log(`Artworks to update: ${report.summary.artworksToUpdate}`);
  console.log(`Artworks updated: ${report.summary.artworksUpdated}`);
  console.log(`Generated links planned: ${report.summary.generatedLinksPlanned}`);
  console.log(
    `Public generated links planned: ${report.summary.publicGeneratedLinksPlanned}`
  );
  console.log(`Preserved book links: ${report.summary.preservedBookLinks}`);

  exitCode = hasMongoWriteFailures(report) ? 1 : 0;
} catch (error) {
  exitCode = 1;
  console.error("Shopify catalog MongoDB linking failed.");
  console.error(error);
} finally {
  await mongoose.disconnect().catch((disconnectError) => {
    exitCode = 1;
    console.error("Failed to disconnect from MongoDB after Shopify link task.");
    console.error(disconnectError);
  });
}

process.exitCode = exitCode;
