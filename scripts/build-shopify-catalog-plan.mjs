#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import helpers from "./build-shopify-catalog-plan-helpers.cjs";

const { buildShopifyCatalogPlan, parsePrintQuantity } = helpers;

const parseArgs = (argv) => {
  const options = {};

  argv.forEach((arg) => {
    if (arg.startsWith("--output=")) {
      options.output = arg.slice("--output=".length);
      return;
    }

    if (arg.startsWith("--print-quantity=")) {
      options.printQuantity = arg.slice("--print-quantity=".length);
      return;
    }

    throw new Error(`Unsupported option: ${arg}`);
  });

  return options;
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

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error(
    "Missing MONGO_URI. Export the MongoDB connection string before running npm run plan:shopify-catalog."
  );
  process.exit(1);
}

let exitCode = 0;

try {
  const args = parseArgs(process.argv.slice(2));
  const printQuantity = parsePrintQuantity({
    cliValue: args.printQuantity,
    envValue: process.env.SHOPIFY_PRINT_QUANTITY,
  });
  const output = args.output ?? "reports/shopify-catalog-dry-run-plan.json";

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  const artworks = await mongoose.connection.db
    .collection("artworks")
    .find(
      {},
      {
        projection: {
          _id: 1,
          title: 1,
          image: 1,
        },
      }
    )
    .toArray();

  const report = buildShopifyCatalogPlan(artworks, { printQuantity });
  const resolvedOutputPath = await writeJsonReport(output, report);

  console.log("Shopify catalog dry-run plan written.");
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Artworks scanned: ${report.summary.totalArtworksScanned}`);
  console.log(
    `Products planned: ${report.summary.originalProductsPlanned} originals, ${report.summary.printProductsPlanned} prints`
  );
  console.log(
    `Warnings: ${report.summary.artworksMissingTitle} missing titles, ${report.summary.artworksMissingImage} missing images, ${report.summary.duplicateGeneratedHandleCount} duplicate generated handles`
  );
} catch (error) {
  exitCode = 1;
  console.error("Shopify catalog dry-run plan failed.");
  console.error(error);
} finally {
  await mongoose.disconnect().catch((disconnectError) => {
    exitCode = 1;
    console.error("Failed to disconnect from MongoDB after catalog dry-run.");
    console.error(disconnectError);
  });
}

process.exitCode = exitCode;
