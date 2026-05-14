#!/usr/bin/env node

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_SEARCH_QUERY = "art";
const DEFAULT_MISSING_PRODUCT_HANDLE = "codex-smoke-missing-product";

const optionNames = new Set([
  "base-url",
  "timeout-ms",
  "search-query",
  "artwork-id",
  "collection-slug",
  "collection-artwork-id",
  "blog-slug",
  "product-handle",
  "missing-product-handle",
  "json",
  "help",
]);

const printHelp = () => {
  console.log(`Usage:
  npm run smoke:public -- --base-url=https://example.vercel.app

Environment alternatives:
  SMOKE_BASE_URL
  SMOKE_TIMEOUT_MS
  SMOKE_SEARCH_QUERY
  SMOKE_ARTWORK_ID
  SMOKE_COLLECTION_SLUG
  SMOKE_COLLECTION_ARTWORK_ID
  SMOKE_BLOG_SLUG
  SMOKE_PRODUCT_HANDLE
  SMOKE_MISSING_PRODUCT_HANDLE

This checks unauthenticated public route statuses and the unauthenticated admin
redirect. It does not perform credentials sign-in, admin dashboard access, or
Vercel log inspection.`);
};

const toCamelCase = (name) =>
  name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

const parseArgs = (argv) => {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "-h" || arg === "--help") {
      options.help = true;
      continue;
    }

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const optionText = arg.slice(2);
    const separatorIndex = optionText.indexOf("=");
    const rawName =
      separatorIndex === -1
        ? optionText
        : optionText.slice(0, separatorIndex);
    const inlineValue =
      separatorIndex === -1 ? undefined : optionText.slice(separatorIndex + 1);

    if (!optionNames.has(rawName)) {
      throw new Error(`Unknown option: --${rawName}`);
    }

    if (rawName === "json" || rawName === "help") {
      options[toCamelCase(rawName)] = true;
      continue;
    }

    const nextValue = inlineValue ?? argv[index + 1];

    if (!nextValue || nextValue.startsWith("--")) {
      throw new Error(`Missing value for --${rawName}`);
    }

    if (inlineValue === undefined) {
      index += 1;
    }

    options[toCamelCase(rawName)] = nextValue;
  }

  return options;
};

const readOption = (options, key, envKey, fallback) =>
  options[key] ?? process.env[envKey] ?? fallback;

const requiredValue = (value) =>
  typeof value === "string" && value.trim().length > 0;

const encodePathSegment = (value) => encodeURIComponent(value.trim());

const normalizeBaseUrl = (value) => {
  if (!requiredValue(value)) {
    throw new Error("Provide --base-url or SMOKE_BASE_URL.");
  }

  const parsed = new URL(value);
  parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  parsed.search = "";
  parsed.hash = "";
  return parsed;
};

const pathWithSearch = (path, params) => {
  const searchParams = new URLSearchParams(params);
  return `${path}?${searchParams.toString()}`;
};

const makeChecks = (options) => {
  const searchQuery = readOption(
    options,
    "searchQuery",
    "SMOKE_SEARCH_QUERY",
    DEFAULT_SEARCH_QUERY
  );
  const missingProductHandle = readOption(
    options,
    "missingProductHandle",
    "SMOKE_MISSING_PRODUCT_HANDLE",
    DEFAULT_MISSING_PRODUCT_HANDLE
  );

  const checks = [
    {
      name: "Home",
      path: "/",
      expectedStatuses: [200],
    },
    {
      name: "Artwork list",
      path: "/artwork",
      expectedStatuses: [200],
    },
    {
      name: "Collections default",
      path: "/collections",
      expectedStatuses: [200],
      note: "The app may redirect to the first collection artwork.",
    },
    {
      name: "Blog list",
      path: "/blog",
      expectedStatuses: [200],
    },
    {
      name: "Search",
      path: pathWithSearch("/search", { q: searchQuery }),
      expectedStatuses: [200],
    },
    {
      name: "Shop listing",
      path: "/shop/products",
      expectedStatuses: [200],
    },
    {
      name: "Product not found",
      path: `/shop/products/${encodePathSegment(missingProductHandle)}`,
      expectedStatuses: [404],
    },
    {
      name: "Sign-in shell",
      path: "/api/auth/signin",
      expectedStatuses: [200],
    },
    {
      name: "Sign-out shell",
      path: "/api/auth/signout",
      expectedStatuses: [200],
    },
    {
      name: "Unauthenticated admin denial",
      path: "/admin/dashboard/articles",
      redirect: "manual",
      expectedStatuses: [302, 303, 307, 308],
      expectedLocationIncludes: "/api/auth/signin",
    },
  ];

  const optionalChecks = [
    {
      name: "Artwork detail",
      path:
        requiredValue(readOption(options, "artworkId", "SMOKE_ARTWORK_ID"))
          ? `/artwork/${encodePathSegment(
              readOption(options, "artworkId", "SMOKE_ARTWORK_ID")
            )}`
          : undefined,
      requires: "SMOKE_ARTWORK_ID",
      expectedStatuses: [200],
    },
    {
      name: "Collection detail",
      path:
        requiredValue(
          readOption(options, "collectionSlug", "SMOKE_COLLECTION_SLUG")
        ) &&
        requiredValue(
          readOption(
            options,
            "collectionArtworkId",
            "SMOKE_COLLECTION_ARTWORK_ID"
          )
        )
          ? `/collections/${encodePathSegment(
              readOption(options, "collectionSlug", "SMOKE_COLLECTION_SLUG")
            )}/${encodePathSegment(
              readOption(
                options,
                "collectionArtworkId",
                "SMOKE_COLLECTION_ARTWORK_ID"
              )
            )}`
          : undefined,
      requires: "SMOKE_COLLECTION_SLUG and SMOKE_COLLECTION_ARTWORK_ID",
      expectedStatuses: [200],
    },
    {
      name: "Blog detail",
      path: requiredValue(readOption(options, "blogSlug", "SMOKE_BLOG_SLUG"))
        ? `/blog/${encodePathSegment(
            readOption(options, "blogSlug", "SMOKE_BLOG_SLUG")
          )}`
        : undefined,
      requires: "SMOKE_BLOG_SLUG",
      expectedStatuses: [200],
    },
    {
      name: "Product detail",
      path: requiredValue(
        readOption(options, "productHandle", "SMOKE_PRODUCT_HANDLE")
      )
        ? `/shop/products/${encodePathSegment(
            readOption(options, "productHandle", "SMOKE_PRODUCT_HANDLE")
          )}`
        : undefined,
      requires: "SMOKE_PRODUCT_HANDLE",
      expectedStatuses: [200],
    },
  ];

  return checks.concat(
    optionalChecks.map((check) =>
      check.path
        ? check
        : {
            ...check,
            skipped: true,
          }
    )
  );
};

const requestCheck = async (baseUrl, check, timeoutMs) => {
  if (check.skipped) {
    return {
      name: check.name,
      path: null,
      status: "skipped",
      reason: `Set ${check.requires} to include this check.`,
    };
  }

  const url = new URL(check.path, baseUrl);
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: check.redirect ?? "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
        "User-Agent": "laoutaris-public-smoke/1.0",
      },
    });
    const durationMs = Date.now() - startedAt;
    const location = response.headers.get("location");
    const statusMatches = check.expectedStatuses.includes(response.status);
    const locationMatches = check.expectedLocationIncludes
      ? location?.includes(check.expectedLocationIncludes) ?? false
      : true;

    return {
      name: check.name,
      path: check.path,
      status: statusMatches && locationMatches ? "passed" : "failed",
      httpStatus: response.status,
      expectedStatuses: check.expectedStatuses,
      location,
      expectedLocationIncludes: check.expectedLocationIncludes,
      redirected: response.redirected,
      finalUrl: response.url,
      durationMs,
      note: check.note,
    };
  } catch (error) {
    return {
      name: check.name,
      path: check.path,
      status: "failed",
      error: error.name === "AbortError" ? "Request timed out" : error.message,
      expectedStatuses: check.expectedStatuses,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const formatResult = (result) => {
  if (result.status === "skipped") {
    return `[SKIP] ${result.name}: ${result.reason}`;
  }

  if (result.status === "passed") {
    const redirectText = result.redirected ? ` -> ${result.finalUrl}` : "";
    return `[PASS] ${result.name}: GET ${result.path} -> ${result.httpStatus}${redirectText} (${result.durationMs}ms)`;
  }

  const expected = result.expectedStatuses?.join(", ") ?? "n/a";
  const detail = result.error
    ? result.error
    : `received ${result.httpStatus}, expected ${expected}`;
  const locationDetail = result.expectedLocationIncludes
    ? `, location ${result.location ?? "missing"}`
    : "";

  return `[FAIL] ${result.name}: GET ${result.path} ${detail}${locationDetail}`;
};

const runCli = async (argv = process.argv.slice(2)) => {
  const options = parseArgs(argv);

  if (options.help) {
    printHelp();
    return 0;
  }

  const baseUrl = normalizeBaseUrl(
    readOption(options, "baseUrl", "SMOKE_BASE_URL")
  );
  const timeoutMs = Number(
    readOption(options, "timeoutMs", "SMOKE_TIMEOUT_MS", DEFAULT_TIMEOUT_MS)
  );

  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("--timeout-ms must be a positive integer.");
  }

  const checks = makeChecks(options);
  const results = [];

  for (const check of checks) {
    results.push(await requestCheck(baseUrl, check, timeoutMs));
  }

  const summary = {
    baseUrl: baseUrl.href,
    passed: results.filter((result) => result.status === "passed").length,
    failed: results.filter((result) => result.status === "failed").length,
    skipped: results.filter((result) => result.status === "skipped").length,
    results,
  };

  if (options.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`Public smoke target: ${summary.baseUrl}`);
    results.forEach((result) => console.log(formatResult(result)));
    console.log(
      `Summary: ${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped.`
    );
  }

  return summary.failed > 0 ? 1 : 0;
};

runCli().then(
  (exitCode) => {
    process.exitCode = exitCode;
  },
  (error) => {
    console.error(error.message);
    process.exitCode = 1;
  }
);
