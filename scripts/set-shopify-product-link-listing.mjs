#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import helpers from "./set-shopify-product-link-listing-helpers.cjs";

const {
  DEFAULT_OUTPUT_PATH,
  applyMongoWriteFailure,
  applyMongoWriteSuccess,
  buildPublicListingPlan,
  hasMongoWriteFailures,
  parseArgs,
  validateExecutionOptions,
  validateMongoEnv,
} = helpers;

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
      { shopifyProducts: { $exists: true, $ne: [] } },
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
    if (artwork.action === "already_matches") {
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
  const outputPath = args.output ?? DEFAULT_OUTPUT_PATH;

  await ensureReportPathWritable(outputPath);
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  const artworks = await getMongoArtworks();
  const report = buildPublicListingPlan({
    artworks,
    type: args.type,
    publicListing: args.publicListing,
    source: {
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
      ? "Shopify product-link public listing write report written."
      : "Shopify product-link public listing plan written."
  );
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Target type: ${args.type}`);
  console.log(`Target publicListing: ${args.publicListing}`);
  console.log(
    `Artworks with target links: ${report.summary.artworksScannedWithTargetLinks}`
  );
  console.log(`Artworks to update: ${report.summary.artworksToUpdate}`);
  console.log(`Artworks updated: ${report.summary.artworksUpdated}`);
  console.log(`Target links scanned: ${report.summary.targetLinksScanned}`);
  console.log(`Target links to change: ${report.summary.targetLinksToChange}`);

  exitCode = hasMongoWriteFailures(report) ? 1 : 0;
} catch (error) {
  exitCode = 1;
  console.error("Shopify product-link public listing task failed.");
  console.error(error);
} finally {
  await mongoose.disconnect().catch((disconnectError) => {
    exitCode = 1;
    console.error(
      "Failed to disconnect from MongoDB after Shopify product-link public listing task."
    );
    console.error(disconnectError);
  });
}

process.exitCode = exitCode;
