import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import ts from "typescript";

type ImportEdge = {
  from: string;
  specifier: string;
  target: string;
};

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

const sourceFileCache = new Map<string, ts.SourceFile>();

const parseSourceFile = (relativePath: string): ts.SourceFile => {
  const cached = sourceFileCache.get(relativePath);

  if (cached) {
    return cached;
  }

  const sourceFile = ts.createSourceFile(
    relativePath,
    readRepoFile(relativePath),
    ts.ScriptTarget.Latest,
    true,
    relativePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  sourceFileCache.set(relativePath, sourceFile);
  return sourceFile;
};

const hasDirective = (relativePath: string, directive: "use client" | "use server") =>
  parseSourceFile(relativePath).statements.some(
    (statement) =>
      ts.isExpressionStatement(statement) &&
      ts.isStringLiteral(statement.expression) &&
      statement.expression.text === directive
  );

const resolveImportPath = (fromFile: string, specifier: string) => {
  if (specifier.startsWith("@/")) {
    return resolveSourcePath(path.posix.join("src", specifier.slice(2)));
  }

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    return resolveSourcePath(
      path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier))
    );
  }

  return null;
};

const resolveSourcePath = (basePath: string) => {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.posix.join(basePath, "index.ts"),
    path.posix.join(basePath, "index.tsx"),
  ];

  return (
    candidates.find((candidate) => {
      const absolutePath = path.join(process.cwd(), candidate);

      return existsSync(absolutePath) && statSync(absolutePath).isFile();
    }) ?? null
  );
};

const getRuntimeImportEdges = (relativePath: string): ImportEdge[] => {
  if (hasDirective(relativePath, "use server")) {
    return [];
  }

  const sourceFile = parseSourceFile(relativePath);
  const edges: ImportEdge[] = [];

  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      !statement.importClause?.isTypeOnly
    ) {
      const target = resolveImportPath(relativePath, statement.moduleSpecifier.text);

      if (target) {
        edges.push({
          from: relativePath,
          specifier: statement.moduleSpecifier.text,
          target,
        });
      }
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      !statement.isTypeOnly
    ) {
      const target = resolveImportPath(relativePath, statement.moduleSpecifier.text);

      if (target) {
        edges.push({
          from: relativePath,
          specifier: statement.moduleSpecifier.text,
          target,
        });
      }
    }
  }

  return edges;
};

const buildClientRuntimeGraph = () => {
  const clientEntries = listRepoSourceFiles("src").filter((sourceFile) =>
    hasDirective(sourceFile, "use client")
  );
  const queue = [...clientEntries];
  const visited = new Set<string>();
  const parentByFile = new Map<string, ImportEdge | null>();

  for (const entry of clientEntries) {
    parentByFile.set(entry, null);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    for (const edge of getRuntimeImportEdges(current)) {
      if (!parentByFile.has(edge.target)) {
        parentByFile.set(edge.target, edge);
      }

      if (!visited.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  return { clientEntries, parentByFile, visited };
};

const clientUnsafeFilePatterns = [
  /^src\/lib\/data\/models(?:\/|$)/,
  /^src\/lib\/data\/services(?:\/|$)/,
  /^src\/lib\/data\/types(?:\/|\.ts$)/,
  /^src\/lib\/db(?:\/|$)/,
  /^src\/lib\/session(?:\/|$)/,
  /^src\/lib\/observability(?:\/|$)/,
  /^src\/lib\/config\/(?:authOptions|authCallbacks)\.ts$/,
  /^src\/lib\/api\/(?:requireApiAdmin|requireApiUser|apiResponse|apiAuthError)\.ts$/,
  /^src\/lib\/api\/shopify\/shopifyClient\.ts$/,
  /^src\/components\/loaders(?:\/|$)/,
  /^src\/lib\/constants\/index\.ts$/,
  /^src\/lib\/transforms\/index\.ts$/,
  /^src\/components\/sections\/index\.ts$/,
  /^src\/components\/views\/index\.ts$/,
  /^src\/components\/elements\/buttons\/index\.ts$/,
  /^src\/components\/modules\/cards\/index\.ts$/,
];

const mixedComponentBarrelSpecifiers = new Set([
  "@/components/sections",
  "@/components/views",
  "@/components/loaders/viewLoaders",
]);

const hasServerOnlyImport = (relativePath: string) =>
  /^\s*import\s+["']server-only["']/.test(readRepoFile(relativePath));

const importsRuntimeValues = (importClause: ts.ImportClause | undefined) => {
  if (!importClause) {
    return true;
  }

  if (importClause.isTypeOnly) {
    return false;
  }

  if (importClause.name) {
    return true;
  }

  const namedBindings = importClause.namedBindings;

  if (!namedBindings) {
    return false;
  }

  if (ts.isNamespaceImport(namedBindings)) {
    return true;
  }

  return namedBindings.elements.some((element) => !element.isTypeOnly);
};

const getMixedComponentBarrelImports = (relativePath: string) => {
  const sourceFile = parseSourceFile(relativePath);
  const violations: string[] = [];

  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      mixedComponentBarrelSpecifiers.has(statement.moduleSpecifier.text) &&
      importsRuntimeValues(statement.importClause)
    ) {
      const { line } = sourceFile.getLineAndCharacterOfPosition(
        statement.getStart()
      );
      violations.push(
        `${relativePath}:${line + 1} imports ${statement.moduleSpecifier.text}`
      );
    }
  }

  return violations;
};

const formatImportChain = (
  relativePath: string,
  parentByFile: Map<string, ImportEdge | null>
) => {
  const chain: string[] = [];
  let current = relativePath;

  while (parentByFile.get(current)) {
    const edge = parentByFile.get(current)!;
    chain.push(`${edge.from} -> ${edge.specifier} -> ${edge.target}`);
    current = edge.from;
  }

  return chain.reverse().join("\n  ");
};

describe("client/server import boundary", () => {
  it("keeps client runtime imports away from server-only code and mixed barrels", () => {
    const { clientEntries, parentByFile, visited } = buildClientRuntimeGraph();

    expect(clientEntries.length).toBeGreaterThan(0);

    const violations = Array.from(visited)
      .filter(
        (sourceFile) =>
          hasServerOnlyImport(sourceFile) ||
          clientUnsafeFilePatterns.some((pattern) => pattern.test(sourceFile))
      )
      .sort()
      .map((sourceFile) => {
        const chain = formatImportChain(sourceFile, parentByFile);

        return chain ? `${sourceFile}\n  ${chain}` : sourceFile;
      });

    expect(violations).toEqual([]);
  });

  it("keeps app routes and server loaders away from mixed component barrel value imports", () => {
    const violations = [
      ...listRepoSourceFiles("src/app"),
      ...listRepoSourceFiles("src/components/loaders"),
    ].flatMap(getMixedComponentBarrelImports);

    expect(violations).toEqual([]);
  });
});
