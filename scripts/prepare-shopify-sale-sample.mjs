#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import helpers from "./prepare-shopify-sale-sample-helpers.cjs";

const { buildSaleSampleSelection, parseArgs } = helpers;

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

let exitCode = 0;

try {
  const args = parseArgs(process.argv.slice(2));
  const { resolvedInputPath, data: reconciliation } = await readJsonFile(
    args.reconciliation
  );
  const selection = buildSaleSampleSelection({
    reconciliation,
    seed: args.seed,
    originalCount: args.originalCount,
    printCount: args.printCount,
    overlapCount: args.overlapCount,
    source: {
      reconciliationInputPath: args.reconciliation,
      reconciliationResolvedInputPath: resolvedInputPath,
      outputPath: args.output,
    },
  });
  const resolvedOutputPath = await writeJsonReport(args.output, selection);

  console.log("Shopify sale sample selection report written.");
  console.log(`Input: ${resolvedInputPath}`);
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Seed: ${selection.selectionPolicy.seed}`);
  console.log(`Selected originals: ${selection.summary.selectedOriginals}`);
  console.log(`Selected prints: ${selection.summary.selectedPrints}`);
  console.log(`Overlap artworks: ${selection.summary.overlapArtworks}`);
  console.log(
    `Original-only artworks: ${selection.summary.originalOnlyArtworks}`
  );
  console.log(`Print-only artworks: ${selection.summary.printOnlyArtworks}`);
} catch (error) {
  exitCode = 1;
  console.error("Shopify sale sample selection failed.");
  console.error(error);
}

process.exitCode = exitCode;
