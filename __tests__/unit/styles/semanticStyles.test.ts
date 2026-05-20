import { readFileSync, readdirSync } from "fs";
import path from "path";
import ts from "typescript";
import { semanticStyles } from "@/lib/styles/semanticStyles";

const styleModulePath = "src/lib/styles/semanticStyles.ts";
const sourceFilePattern = /\.(?:ts|tsx)$/;

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const listRepoSourceFiles = (relativeDir: string): string[] =>
  readdirSync(path.join(process.cwd(), relativeDir), { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.posix.join(relativeDir, entry.name);

      if (entry.isDirectory()) {
        return listRepoSourceFiles(relativePath);
      }

      return sourceFilePattern.test(entry.name) ? [relativePath] : [];
    })
    .sort();

const flattenStyleValues = (node: unknown): string[] => {
  if (typeof node === "string") {
    return [node];
  }

  if (node && typeof node === "object") {
    return Object.values(node as Record<string, unknown>).flatMap(
      flattenStyleValues
    );
  }

  return [];
};

const unwrapExpression = (expression: ts.Expression): ts.Expression => {
  if (
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isParenthesizedExpression(expression)
  ) {
    return unwrapExpression(expression.expression);
  }

  return expression;
};

const getPropertyName = (name: ts.PropertyName) => {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return name.getText();
};

const findSemanticStylesInitializer = () => {
  const sourceFile = ts.createSourceFile(
    styleModulePath,
    readRepoFile(styleModulePath),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === "semanticStyles" &&
        declaration.initializer
      ) {
        return unwrapExpression(declaration.initializer);
      }
    }
  }

  throw new Error("semanticStyles initializer was not found");
};

const collectNonLiteralLeaves = (
  expression: ts.Expression,
  pathSegments: string[] = []
): string[] => {
  const unwrapped = unwrapExpression(expression);

  if (ts.isObjectLiteralExpression(unwrapped)) {
    return unwrapped.properties.flatMap((property) => {
      if (!ts.isPropertyAssignment(property)) {
        return [`${pathSegments.join(".")} uses a non-property assignment`];
      }

      return collectNonLiteralLeaves(property.initializer, [
        ...pathSegments,
        getPropertyName(property.name),
      ]);
    });
  }

  return ts.isStringLiteral(unwrapped) ? [] : [pathSegments.join(".")];
};

describe("semanticStyles", () => {
  it("exports the first semantic role scaffold as literal class strings", () => {
    expect(semanticStyles).toEqual({
      text: {
        pageTitle: "text-5xl font-bold",
        displayTitle:
          "font-cormorant text-5xl font-semibold leading-none text-slate sm:text-6xl lg:text-7xl xl:text-[82px] 2xl:text-[96px]",
        sectionHeading: "text-4xl font-archivo font-semibold",
        cardTitle: "text-lg font-semibold mb-2 line-clamp-2",
        body: "text-gray-700 leading-relaxed",
        bodyMuted: "text-sm text-gray-600",
        caption: "text-sm text-gray-500",
        eyebrow: "font-archivo text-xs uppercase text-slate/80",
      },
      action: {
        primary:
          "block w-full rounded-md bg-black px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-gray-800",
        secondary:
          "inline-flex min-h-[56px] w-full max-w-[240px] items-center justify-between border border-slate px-7 font-archivo text-base font-semibold text-slate transition-colors hover:bg-slate hover:text-whitish focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate",
        textLink:
          "border-b border-[#9a713d] pb-2 font-archivo text-sm uppercase text-[#9a713d] transition-colors hover:text-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate",
      },
      layout: {
        pageFrame: "max-w-7xl mx-auto px-4",
        sectionBand: "w-full border-t border-slate/10 bg-whitish text-slate",
        contentRail: "max-w-xl",
      },
      surface: {
        card: "relative group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all",
        mediaFrame: "relative aspect-square mb-2 overflow-hidden rounded-md",
      },
    });

    expect(flattenStyleValues(semanticStyles).every(Boolean)).toBe(true);
  });

  it("keeps every semantic value copied from an existing source class pattern", () => {
    const sourceCorpus = listRepoSourceFiles("src")
      .filter((sourceFile) => sourceFile !== styleModulePath)
      .map(readRepoFile)
      .join("\n");

    for (const className of flattenStyleValues(semanticStyles)) {
      expect(sourceCorpus).toContain(className);
    }
  });

  it("keeps the module client-safe and free of dynamic class generation", () => {
    const source = readRepoFile(styleModulePath);

    expect(source).not.toMatch(/^\s*["']use server["']/m);
    expect(source).not.toMatch(/^\s*import\s/m);
    expect(source).not.toMatch(/\bfrom\s+["']/);
    expect(source).not.toMatch(/\brequire\s*\(/);
    expect(source).not.toMatch(/\bimport\s*\(/);
    expect(source).not.toMatch(/\b(?:cn|cva|clsx|twMerge)\s*\(/);
    expect(source).not.toMatch(/`|\$\{/);
    expect(source).not.toMatch(
      /server-only|@\/lib\/data\/(?:models|services)|@\/lib\/db|@\/lib\/session|@\/components\/loaders|@\/components\/views|@\/components\/sections|@\/components\/modules\/cards|src\/app\/api/
    );
  });

  it("defines semantic leaves as source-level string literals", () => {
    expect(collectNonLiteralLeaves(findSemanticStylesInitializer())).toEqual([]);
  });

  it("does not adopt the scaffold in runtime components yet", () => {
    const importPattern =
      /from\s+["'](?:@\/lib\/styles\/semanticStyles|.*\/semanticStyles)["']/;

    const runtimeImports = listRepoSourceFiles("src")
      .filter((sourceFile) => sourceFile !== styleModulePath)
      .filter((sourceFile) => importPattern.test(readRepoFile(sourceFile)));

    expect(runtimeImports).toEqual([]);
  });
});
