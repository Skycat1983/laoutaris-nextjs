#!/usr/bin/env node

import mongoose from "mongoose";
import helpers from "./audit-shopify-product-link-helpers.cjs";

const {
  auditArtworkDocuments,
  formatAuditReport,
  hasBlockingFindings,
} = helpers;

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error(
    "Missing MONGO_URI. Export the MongoDB connection string before running npm run audit:shopify-products."
  );
  process.exit(1);
}

let exitCode = 0;

try {
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
          shopifyProducts: 1,
        },
      }
    )
    .toArray();

  const report = auditArtworkDocuments(artworks);
  console.log(formatAuditReport(report));

  exitCode = hasBlockingFindings(report) ? 1 : 0;
} catch (error) {
  exitCode = 1;
  console.error("Shopify product link audit failed.");
  console.error(error);
} finally {
  await mongoose.disconnect().catch((disconnectError) => {
    exitCode = 1;
    console.error("Failed to disconnect from MongoDB after audit.");
    console.error(disconnectError);
  });
}

process.exitCode = exitCode;
