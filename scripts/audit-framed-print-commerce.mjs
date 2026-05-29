#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import helpers from "./audit-framed-print-commerce-helpers.cjs";

const { buildFramedPrintCommerceAudit, parseArgs } = helpers;

const readJsonFile = async (inputPath) => {
  const resolvedInputPath = path.resolve(process.cwd(), inputPath);
  const content = await fs.readFile(resolvedInputPath, "utf8");

  return {
    resolvedInputPath,
    data: JSON.parse(content),
  };
};

const readOptionalJsonFile = async (inputPath) => {
  if (!inputPath) {
    return {
      resolvedInputPath: null,
      data: null,
    };
  }

  try {
    return await readJsonFile(inputPath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        resolvedInputPath: null,
        data: null,
      };
    }

    throw error;
  }
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
  const { resolvedInputPath: resolvedPlanPath, data: plan } =
    await readJsonFile(args.plan);
  const { resolvedInputPath: resolvedSelectionPath, data: selection } =
    await readOptionalJsonFile(args.selection);
  const report = buildFramedPrintCommerceAudit({
    plan,
    selection,
    basePrintPrice: args.basePrintPrice,
    currencyCode: args.currencyCode,
    source: {
      planInputPath: args.plan,
      planResolvedInputPath: resolvedPlanPath,
      selectionInputPath: args.selection,
      selectionResolvedInputPath: resolvedSelectionPath,
      outputPath: args.output,
    },
  });
  const resolvedOutputPath = await writeJsonReport(args.output, report);

  console.log("Framed print commerce formula pricing audit written.");
  console.log(`Plan input: ${resolvedPlanPath}`);
  console.log(
    `Selection input: ${resolvedSelectionPath ?? "none; sale sample not marked"}`
  );
  console.log(`Output: ${resolvedOutputPath}`);
  console.log(`Print products audited: ${report.summary.totalPrintProducts}`);
  console.log(
    `Valid measurements: ${report.summary.validMeasurementPrintProducts}; invalid measurements: ${report.summary.invalidMeasurementPrintProducts}`
  );
  console.log(
    `Sale-sample prints marked: ${report.summary.saleSamplePrintProducts}`
  );
  console.log(
    `Draft variant rows proposed for review: ${report.summary.proposedVariantRows}`
  );
} catch (error) {
  exitCode = 1;
  console.error("Framed print commerce formula pricing audit failed.");
  console.error(error);
}

process.exitCode = exitCode;
