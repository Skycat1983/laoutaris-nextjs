import { readdirSync, readFileSync } from "fs";
import path from "path";

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

type FetcherOperation = {
  id: string;
  method: HttpMethod;
  path: string;
  sourceFile: string;
};

const API_ROUTE_DIR = path.join(process.cwd(), "src/app/api/v2");
const API_ROUTE_PREFIX = "/api/v2";
const FETCHER_DIR = path.join(process.cwd(), "src/lib/api");

const FETCHER_OPERATIONS: FetcherOperation[] = [
  {
    id: "admin.create.article",
    method: "POST",
    path: "/api/v2/admin/article/create",
    sourceFile: "src/lib/api/admin/create/fetchers.ts",
  },
  {
    id: "admin.create.collection",
    method: "POST",
    path: "/api/v2/admin/collection/create",
    sourceFile: "src/lib/api/admin/create/fetchers.ts",
  },
  {
    id: "admin.create.artwork",
    method: "POST",
    path: "/api/v2/admin/artwork/create",
    sourceFile: "src/lib/api/admin/create/fetchers.ts",
  },
  {
    id: "admin.create.blog",
    method: "POST",
    path: "/api/v2/admin/blog/create",
    sourceFile: "src/lib/api/admin/create/fetchers.ts",
  },
  {
    id: "admin.delete.artwork",
    method: "DELETE",
    path: "/api/v2/admin/artwork/delete/[id]",
    sourceFile: "src/lib/api/admin/delete/fetchers.ts",
  },
  {
    id: "admin.delete.article",
    method: "DELETE",
    path: "/api/v2/admin/article/delete/[id]",
    sourceFile: "src/lib/api/admin/delete/fetchers.ts",
  },
  {
    id: "admin.delete.blog",
    method: "DELETE",
    path: "/api/v2/admin/blog/delete/[id]",
    sourceFile: "src/lib/api/admin/delete/fetchers.ts",
  },
  {
    id: "admin.delete.collection",
    method: "DELETE",
    path: "/api/v2/admin/collection/delete/[id]",
    sourceFile: "src/lib/api/admin/delete/fetchers.ts",
  },
  {
    id: "admin.delete.user",
    method: "DELETE",
    path: "/api/v2/admin/user/delete/[id]",
    sourceFile: "src/lib/api/admin/delete/fetchers.ts",
  },
  {
    id: "admin.delete.comment",
    method: "DELETE",
    path: "/api/v2/admin/comment/delete/[id]",
    sourceFile: "src/lib/api/admin/delete/fetchers.ts",
  },
  {
    id: "admin.read.artwork",
    method: "GET",
    path: "/api/v2/admin/artwork/read/[id]",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.article",
    method: "GET",
    path: "/api/v2/admin/article/read/[id]",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.collection",
    method: "GET",
    path: "/api/v2/admin/collection/read/[id]",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.blog",
    method: "GET",
    path: "/api/v2/admin/blog/read/[id]",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.user",
    method: "GET",
    path: "/api/v2/admin/user/read/[id]",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.comment",
    method: "GET",
    path: "/api/v2/admin/comment/read/[id]",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.artworks",
    method: "GET",
    path: "/api/v2/admin/artwork/read",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.articles",
    method: "GET",
    path: "/api/v2/admin/article/read",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.collections",
    method: "GET",
    path: "/api/v2/admin/collection/read",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.blogs",
    method: "GET",
    path: "/api/v2/admin/blog/read",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.users",
    method: "GET",
    path: "/api/v2/admin/user/read",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.read.comments",
    method: "GET",
    path: "/api/v2/admin/comment/read",
    sourceFile: "src/lib/api/admin/read/fetchers.ts",
  },
  {
    id: "admin.update.article",
    method: "PATCH",
    path: "/api/v2/admin/article/update/[id]",
    sourceFile: "src/lib/api/admin/update/fetchers.ts",
  },
  {
    id: "admin.update.collection",
    method: "PATCH",
    path: "/api/v2/admin/collection/update/[id]",
    sourceFile: "src/lib/api/admin/update/fetchers.ts",
  },
  {
    id: "admin.update.artwork",
    method: "PATCH",
    path: "/api/v2/admin/artwork/update/[id]",
    sourceFile: "src/lib/api/admin/update/fetchers.ts",
  },
  {
    id: "admin.update.blog",
    method: "PATCH",
    path: "/api/v2/admin/blog/update/[id]",
    sourceFile: "src/lib/api/admin/update/fetchers.ts",
  },
  {
    id: "public.article.single",
    method: "GET",
    path: "/api/v2/public/article/[slug]",
    sourceFile: "src/lib/api/public/article/fetchers.ts",
  },
  {
    id: "public.article.multiple",
    method: "GET",
    path: "/api/v2/public/article",
    sourceFile: "src/lib/api/public/article/fetchers.ts",
  },
  {
    id: "public.article.singlePopulated",
    method: "GET",
    path: "/api/v2/public/article/[slug]",
    sourceFile: "src/lib/api/public/article/fetchers.ts",
  },
  {
    id: "public.artwork.single",
    method: "GET",
    path: "/api/v2/public/artwork/[id]",
    sourceFile: "src/lib/api/public/artwork/fetchers.ts",
  },
  {
    id: "public.artwork.multiple",
    method: "GET",
    path: "/api/v2/public/artwork",
    sourceFile: "src/lib/api/public/artwork/fetchers.ts",
  },
  {
    id: "public.blog.single",
    method: "GET",
    path: "/api/v2/public/blog/[slug]",
    sourceFile: "src/lib/api/public/blog/fetchers.ts",
  },
  {
    id: "public.blog.multiple",
    method: "GET",
    path: "/api/v2/public/blog",
    sourceFile: "src/lib/api/public/blog/fetchers.ts",
  },
  {
    id: "public.blog.singlePopulated",
    method: "GET",
    path: "/api/v2/public/blog/[slug]/comments",
    sourceFile: "src/lib/api/public/blog/fetchers.ts",
  },
  {
    id: "public.collection.single",
    method: "GET",
    path: "/api/v2/public/collection/[slug]",
    sourceFile: "src/lib/api/public/collection/fetchers.ts",
  },
  {
    id: "public.collection.multiple",
    method: "GET",
    path: "/api/v2/public/collection",
    sourceFile: "src/lib/api/public/collection/fetchers.ts",
  },
  {
    id: "public.collection.singleCollectionAllArtwork",
    method: "GET",
    path: "/api/v2/public/collection/[slug]/artwork",
    sourceFile: "src/lib/api/public/collection/fetchers.ts",
  },
  {
    id: "public.collection.singleCollectionSingleArtwork",
    method: "GET",
    path: "/api/v2/public/collection/[slug]/artwork/[artworkId]",
    sourceFile: "src/lib/api/public/collection/fetchers.ts",
  },
  {
    id: "public.enquiry.create",
    method: "POST",
    path: "/api/v2/public/enquiry",
    sourceFile: "src/lib/api/public/enquiry/fetchers.ts",
  },
  {
    id: "public.navigation.fetchArticleNavigationList",
    method: "GET",
    path: "/api/v2/public/navigation/articles/[section]",
    sourceFile: "src/lib/api/public/navigation/fetchers.ts",
  },
  {
    id: "public.navigation.fetchCollectionNavigationList",
    method: "GET",
    path: "/api/v2/public/navigation/collections",
    sourceFile: "src/lib/api/public/navigation/fetchers.ts",
  },
  {
    id: "public.navigation.fetchCollectionNavigationItem",
    method: "GET",
    path: "/api/v2/public/navigation/collections/[slug]",
    sourceFile: "src/lib/api/public/navigation/fetchers.ts",
  },
  {
    id: "public.navigation.fetchCollectionArtworksNavigation",
    method: "GET",
    path: "/api/v2/public/navigation/collections/[slug]/artworks",
    sourceFile: "src/lib/api/public/navigation/fetchers.ts",
  },
  {
    id: "public.search.search",
    method: "GET",
    path: "/api/v2/public/search",
    sourceFile: "src/lib/api/public/search/fetchers.ts",
  },
  {
    id: "user.comments.getUserComments",
    method: "GET",
    path: "/api/v2/user/comment",
    sourceFile: "src/lib/api/user/comments/fetchers.ts",
  },
  {
    id: "user.comments.createComment",
    method: "POST",
    path: "/api/v2/user/comment",
    sourceFile: "src/lib/api/user/comments/fetchers.ts",
  },
  {
    id: "user.comments.updateComment",
    method: "PATCH",
    path: "/api/v2/user/comment/[commentId]",
    sourceFile: "src/lib/api/user/comments/fetchers.ts",
  },
  {
    id: "user.comments.deleteComment",
    method: "DELETE",
    path: "/api/v2/user/comment/[commentId]",
    sourceFile: "src/lib/api/user/comments/fetchers.ts",
  },
  {
    id: "user.favorites.getList",
    method: "GET",
    path: "/api/v2/user/favourite",
    sourceFile: "src/lib/api/user/favorites/fetchers.ts",
  },
  {
    id: "user.favorites.getOne",
    method: "GET",
    path: "/api/v2/user/favourite/[artworkId]",
    sourceFile: "src/lib/api/user/favorites/fetchers.ts",
  },
  {
    id: "user.navigation.fetchUserNavigation",
    method: "GET",
    path: "/api/v2/user/navigation",
    sourceFile: "src/lib/api/user/navigation/fetchers.ts",
  },
  {
    id: "user.profile.get",
    method: "GET",
    path: "/api/v2/user/profile",
    sourceFile: "src/lib/api/user/profile/fetchers.ts",
  },
  {
    id: "user.watchlist.getList",
    method: "GET",
    path: "/api/v2/user/watchlist",
    sourceFile: "src/lib/api/user/watchlist/fetchers.ts",
  },
  {
    id: "user.watchlist.getOne",
    method: "GET",
    path: "/api/v2/user/watchlist/[artworkId]",
    sourceFile: "src/lib/api/user/watchlist/fetchers.ts",
  },
];

const KNOWN_ROUTE_FETCHER_GAP_IDS = new Set<string>();

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

const normalizeRoutePath = (routePath: string) => {
  const [pathname] = routePath.split("?");
  const withoutTrailingSlash =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  return withoutTrailingSlash.replace(/\[[^\]]+\]/g, "[param]");
};

const getRoutePathFromFile = (filePath: string) => {
  const relativePath = path
    .relative(API_ROUTE_DIR, filePath)
    .split(path.sep)
    .join("/");
  const routePath = relativePath.replace(/\/route\.ts$/, "");

  return routePath ? `${API_ROUTE_PREFIX}/${routePath}` : API_ROUTE_PREFIX;
};

const getExportedMethods = (source: string): HttpMethod[] => {
  const routeSource = stripComments(source);

  return HTTP_METHODS.filter((method) => {
    const methodPattern = new RegExp(
      `export\\s+(?:async\\s+function\\s+${method}\\b|function\\s+${method}\\b|const\\s+${method}\\s*=)`
    );

    return methodPattern.test(routeSource);
  });
};

const buildRouteManifest = () => {
  const routeFiles = listFiles(API_ROUTE_DIR).filter((filePath) =>
    filePath.endsWith(`${path.sep}route.ts`)
  );

  return routeFiles.reduce((manifest, filePath) => {
    const methods = getExportedMethods(readFileSync(filePath, "utf8"));
    const routePath = normalizeRoutePath(getRoutePathFromFile(filePath));

    manifest.set(routePath, new Set(methods));

    return manifest;
  }, new Map<string, Set<HttpMethod>>());
};

const getFetcherSourceFiles = () =>
  sortStrings(
    listFiles(FETCHER_DIR)
      .filter((filePath) => filePath.endsWith(`${path.sep}fetchers.ts`))
      .map(toRepoPath)
  );

const countFetcherCalls = (source: string) =>
  stripComments(source).match(/\bfetcher\s*(?:<|\()/g)?.length ?? 0;

const getInventoriedCallCounts = () =>
  FETCHER_OPERATIONS.reduce<Record<string, number>>((counts, operation) => {
    counts[operation.sourceFile] = (counts[operation.sourceFile] ?? 0) + 1;
    return counts;
  }, {});

const getActualCallCounts = () =>
  getFetcherSourceFiles().reduce<Record<string, number>>(
    (counts, sourceFile) => {
      const source = readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      counts[sourceFile] = countFetcherCalls(source);
      return counts;
    },
    {}
  );

const isOperationBackedByRoute = (
  operation: FetcherOperation,
  routeManifest: Map<string, Set<HttpMethod>>
) =>
  routeManifest.get(normalizeRoutePath(operation.path))?.has(operation.method) ??
  false;

const formatOperation = (operation: FetcherOperation) =>
  `${operation.id}: ${operation.method} ${operation.path} (${operation.sourceFile})`;

describe("route/fetcher parity inventory", () => {
  it("keeps the explicit fetcher inventory aligned with current fetcher files", () => {
    const actualFetcherFiles = getFetcherSourceFiles();
    const inventoriedFetcherFiles = sortStrings(
      Array.from(
        new Set(FETCHER_OPERATIONS.map((operation) => operation.sourceFile))
      )
    );
    const actualCallCounts = getActualCallCounts();
    const inventoriedCallCounts = getInventoriedCallCounts();
    const operationIds = FETCHER_OPERATIONS.map((operation) => operation.id);

    expect(inventoriedFetcherFiles).toEqual(actualFetcherFiles);
    expect(inventoriedCallCounts).toEqual(actualCallCounts);
    expect(sortStrings(operationIds)).toHaveLength(new Set(operationIds).size);
  });

  it("backs every non-allowlisted fetcher operation with a matching route method", () => {
    const routeManifest = buildRouteManifest();
    const unsupportedOperations = FETCHER_OPERATIONS.filter(
      (operation) => !KNOWN_ROUTE_FETCHER_GAP_IDS.has(operation.id)
    )
      .filter((operation) => !isOperationBackedByRoute(operation, routeManifest))
      .map(formatOperation);

    expect(unsupportedOperations).toEqual([]);
  });

  it("keeps the F-037 known-gap allowlist self-checking", () => {
    const routeManifest = buildRouteManifest();
    const knownGapOperations = FETCHER_OPERATIONS.filter((operation) =>
      KNOWN_ROUTE_FETCHER_GAP_IDS.has(operation.id)
    );
    const staleKnownGaps = knownGapOperations
      .filter((operation) => isOperationBackedByRoute(operation, routeManifest))
      .map(
        (operation) =>
          `${formatOperation(operation)} is now backed by a route; remove it from KNOWN_ROUTE_FETCHER_GAP_IDS.`
      );

    expect(sortStrings(knownGapOperations.map((operation) => operation.id))).toEqual(
      sortStrings(Array.from(KNOWN_ROUTE_FETCHER_GAP_IDS))
    );
    expect(staleKnownGaps).toEqual([]);
  });
});
