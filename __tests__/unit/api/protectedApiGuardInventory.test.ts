import { readdirSync, readFileSync } from "fs";
import path from "path";
import ts from "typescript";

const HTTP_METHODS = [
  "GET",
  "POST",
  "PATCH",
  "PUT",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

type HttpMethod = (typeof HTTP_METHODS)[number];

type ProtectedRouteGroup = {
  name: string;
  rootDir: string;
  guardName: "requireApiUser" | "requireApiAdmin";
  guardImportPath: string;
};

type RouteFile = {
  filePath: string;
  repoPath: string;
  group: ProtectedRouteGroup;
};

type ExportedMethodHandler = {
  method: HttpMethod;
  body: string;
};

type PreGuardOperationPattern = {
  label: string;
  pattern: RegExp;
};

const PROTECTED_ROUTE_GROUPS: ProtectedRouteGroup[] = [
  {
    name: "user",
    rootDir: path.join(process.cwd(), "src/app/api/v2/user"),
    guardName: "requireApiUser",
    guardImportPath: "@/lib/api/requireApiUser",
  },
  {
    name: "admin",
    rootDir: path.join(process.cwd(), "src/app/api/v2/admin"),
    guardName: "requireApiAdmin",
    guardImportPath: "@/lib/api/requireApiAdmin",
  },
];

const FORBIDDEN_ROUTE_BOUNDARY_HELPERS = [
  "getServerSession",
  "getUserIdFromSession",
  "isAdmin",
] as const;

const PRE_GUARD_OPERATION_PATTERNS: PreGuardOperationPattern[] = [
  {
    label: "request body read",
    pattern:
      /\b(?:request|req)\s*\.\s*(?:json|formData|text|arrayBuffer|blob)\s*\(/,
  },
  {
    label: "dbConnect()",
    pattern: /\bdbConnect\s*\(/,
  },
  {
    label: "model read/write",
    pattern:
      /\b[A-Z][A-Za-z0-9]*Model\s*\.\s*(?:aggregate|bulkWrite|countDocuments|create|deleteMany|deleteOne|distinct|find|findById|findByIdAndDelete|findByIdAndRemove|findByIdAndUpdate|findOne|findOneAndDelete|findOneAndRemove|findOneAndUpdate|insertMany|startSession|updateMany|updateOne)\s*\(/,
  },
  {
    label: "document save",
    pattern: /\.\s*save\s*\(/,
  },
  {
    label: "transaction setup",
    pattern:
      /\bmongoose\s*\.\s*startSession\s*\(|\.\s*startSession\s*\(|\.\s*startTransaction\s*\(/,
  },
];

const sortStrings = (values: string[]) =>
  [...values].sort((a, b) => a.localeCompare(b));

const listFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });

const toRepoPath = (filePath: string) =>
  path.relative(process.cwd(), filePath).split(path.sep).join("/");

const stripComments = (source: string) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => line.replace(/\/\/.*$/, ""))
    .join("\n");

const createSourceFile = (source: string, filePath: string) =>
  ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);

const isExported = (node: { modifiers?: ts.NodeArray<ts.ModifierLike> }) =>
  node.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
  ) ?? false;

const isHttpMethod = (name: string): name is HttpMethod =>
  HTTP_METHODS.includes(name as HttpMethod);

const getProtectedRouteFiles = (): RouteFile[] =>
  PROTECTED_ROUTE_GROUPS.flatMap((group) =>
    listFiles(group.rootDir)
      .filter((filePath) => filePath.endsWith(`${path.sep}route.ts`))
      .map((filePath) => ({
        filePath,
        repoPath: toRepoPath(filePath),
        group,
      }))
  ).sort((a, b) => a.repoPath.localeCompare(b.repoPath));

const hasExpectedGuardImport = (
  sourceFile: ts.SourceFile,
  group: ProtectedRouteGroup
) =>
  sourceFile.statements.some((statement) => {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== group.guardImportPath
    ) {
      return false;
    }

    const namedBindings = statement.importClause?.namedBindings;
    if (!namedBindings || !ts.isNamedImports(namedBindings)) {
      return false;
    }

    return namedBindings.elements.some(
      (element) =>
        (element.propertyName?.text ?? element.name.text) === group.guardName
    );
  });

const getForbiddenImportedHelpers = (sourceFile: ts.SourceFile) => {
  const forbiddenHelpers = new Set<string>(FORBIDDEN_ROUTE_BOUNDARY_HELPERS);
  const importedHelpers: string[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue;
    }

    const importClause = statement.importClause;

    if (importClause?.name && forbiddenHelpers.has(importClause.name.text)) {
      importedHelpers.push(importClause.name.text);
    }

    const namedBindings = importClause?.namedBindings;
    if (!namedBindings || !ts.isNamedImports(namedBindings)) {
      continue;
    }

    for (const element of namedBindings.elements) {
      const importedName = element.propertyName?.text ?? element.name.text;
      if (forbiddenHelpers.has(importedName)) {
        importedHelpers.push(importedName);
      }
    }
  }

  return sortStrings(importedHelpers);
};

const getForbiddenHelperCalls = (source: string) => {
  const strippedSource = stripComments(source);

  return FORBIDDEN_ROUTE_BOUNDARY_HELPERS.filter((helperName) =>
    new RegExp(`\\b${helperName}\\s*\\(`).test(strippedSource)
  );
};

const getExportedMethodHandlers = (
  sourceFile: ts.SourceFile
): ExportedMethodHandler[] => {
  const handlers: ExportedMethodHandler[] = [];

  for (const statement of sourceFile.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      isExported(statement) &&
      statement.name &&
      isHttpMethod(statement.name.text) &&
      statement.body
    ) {
      handlers.push({
        method: statement.name.text,
        body: statement.body.getText(sourceFile),
      });
      continue;
    }

    if (!ts.isVariableStatement(statement) || !isExported(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        !isHttpMethod(declaration.name.text)
      ) {
        continue;
      }

      const initializer = declaration.initializer;
      if (
        initializer &&
        (ts.isArrowFunction(initializer) ||
          ts.isFunctionExpression(initializer)) &&
        ts.isBlock(initializer.body)
      ) {
        handlers.push({
          method: declaration.name.text,
          body: initializer.body.getText(sourceFile),
        });
      }
    }
  }

  return handlers.sort(
    (a, b) => HTTP_METHODS.indexOf(a.method) - HTTP_METHODS.indexOf(b.method)
  );
};

const getFirstMatchIndex = (source: string, pattern: RegExp) => {
  const match = source.match(pattern);
  return match?.index ?? -1;
};

const getFirstPreGuardOperation = (source: string) =>
  PRE_GUARD_OPERATION_PATTERNS.map((operationPattern) => ({
    label: operationPattern.label,
    index: getFirstMatchIndex(source, operationPattern.pattern),
  }))
    .filter((operation) => operation.index >= 0)
    .sort((a, b) => a.index - b.index)[0];

describe("protected API guard inventory", () => {
  it("inventories protected user and admin route files", () => {
    const routeFilesByGroup = PROTECTED_ROUTE_GROUPS.reduce<
      Record<string, string[]>
    >((filesByGroup, group) => {
      filesByGroup[group.name] = getProtectedRouteFiles()
        .filter((routeFile) => routeFile.group.name === group.name)
        .map((routeFile) => routeFile.repoPath);
      return filesByGroup;
    }, {});

    expect(routeFilesByGroup.user.length).toBeGreaterThan(0);
    expect(routeFilesByGroup.admin.length).toBeGreaterThan(0);
  });

  it("requires protected route files to import and call the shared guard", () => {
    const missingGuardUsage = getProtectedRouteFiles().flatMap((routeFile) => {
      const source = readFileSync(routeFile.filePath, "utf8");
      const sourceFile = createSourceFile(source, routeFile.filePath);
      const strippedSource = stripComments(source);
      const missing: string[] = [];

      if (!hasExpectedGuardImport(sourceFile, routeFile.group)) {
        missing.push(
          `missing import from ${routeFile.group.guardImportPath}`
        );
      }

      if (
        !new RegExp(`\\b${routeFile.group.guardName}\\s*\\(`).test(
          strippedSource
        )
      ) {
        missing.push(`missing ${routeFile.group.guardName}() call`);
      }

      return missing.map(
        (reason) => `${routeFile.repoPath}: ${reason}`
      );
    });

    expect(missingGuardUsage).toEqual([]);
  });

  it("rejects direct session and legacy admin helper checks at route boundaries", () => {
    const directHelperUsage = getProtectedRouteFiles().flatMap((routeFile) => {
      const source = readFileSync(routeFile.filePath, "utf8");
      const sourceFile = createSourceFile(source, routeFile.filePath);
      const forbiddenImports = getForbiddenImportedHelpers(sourceFile).map(
        (helperName) => `imports ${helperName}`
      );
      const forbiddenCalls = getForbiddenHelperCalls(source).map(
        (helperName) => `calls ${helperName}()`
      );

      return [...forbiddenImports, ...forbiddenCalls].map(
        (reason) => `${routeFile.repoPath}: ${reason}`
      );
    });

    expect(directHelperUsage).toEqual([]);
  });

  it("calls the shared guard before body reads, DB work, model work, or transactions in every handler", () => {
    const guardOrderViolations = getProtectedRouteFiles().flatMap(
      (routeFile) => {
        const source = readFileSync(routeFile.filePath, "utf8");
        const sourceFile = createSourceFile(source, routeFile.filePath);
        const handlers = getExportedMethodHandlers(sourceFile);

        if (handlers.length === 0) {
          return [`${routeFile.repoPath}: no exported HTTP method handler found`];
        }

        return handlers.flatMap((handler) => {
          const body = stripComments(handler.body);
          const guardIndex = getFirstMatchIndex(
            body,
            new RegExp(`\\b${routeFile.group.guardName}\\s*\\(`)
          );
          const firstOperation = getFirstPreGuardOperation(body);
          const handlerLabel = `${routeFile.repoPath} ${handler.method}`;

          if (guardIndex < 0) {
            return [
              `${handlerLabel}: missing ${routeFile.group.guardName}() in exported handler`,
            ];
          }

          if (firstOperation && firstOperation.index < guardIndex) {
            return [
              `${handlerLabel}: ${firstOperation.label} appears before ${routeFile.group.guardName}()`,
            ];
          }

          return [];
        });
      }
    );

    expect(guardOrderViolations).toEqual([]);
  });
});
