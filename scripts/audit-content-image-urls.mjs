#!/usr/bin/env node

import { MongoClient } from "mongodb";

const ALLOWED_SOURCES = [
  {
    category: "acceptedCloudinary",
    protocol: "https:",
    hostname: "res.cloudinary.com",
    pathnamePrefix: "/dzncmfirr/",
  },
  {
    category: "acceptedExternalAllowlistHost",
    protocol: "https:",
    hostname: "cdn-icons-png.flaticon.com",
    pathnamePrefix: "/",
  },
  {
    category: "acceptedExternalAllowlistHost",
    protocol: "https:",
    hostname: "cdn.shopify.com",
    pathnamePrefix: "/",
  },
];

const CATEGORIES = [
  "acceptedCloudinary",
  "acceptedExternalAllowlistHost",
  "missingEmptyWhereAllowed",
  "malformedUrl",
  "unsupportedHost",
  "mismatchedCloudinaryCloudOrPath",
];

const COLLECTIONS = [
  { collectionName: "articles", label: "article" },
  { collectionName: "blogs", label: "blog" },
  { collectionName: "collections", label: "collection" },
];

const EXAMPLE_LIMIT = 5;
const PATH_PREVIEW_LIMIT = 120;

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error(
    "Missing MONGO_URI. Export the MongoDB connection string before running node scripts/audit-content-image-urls.mjs."
  );
  process.exit(1);
}

const createBucket = () => ({
  total: 0,
  counts: Object.fromEntries(CATEGORIES.map((category) => [category, 0])),
  examples: Object.fromEntries(CATEGORIES.map((category) => [category, []])),
});

const parseUrl = (value) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const redactConnectionDetails = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(mongoUri, "<redacted-mongo-uri>")
    .replace(
      /mongodb(?:\+srv)?:\/\/[^@\s]+@/g,
      "mongodb://<redacted-credentials>@"
    );
};

const logSafeError = (prefix, error) => {
  console.error(prefix);

  if (error && typeof error === "object") {
    const { name, message } = error;
    console.error(`Error type: ${typeof name === "string" ? name : "Error"}`);

    if (typeof message === "string" && message.trim()) {
      console.error(`Error message: ${redactConnectionDetails(message)}`);
    }

    return;
  }

  if (typeof error === "string" && error.trim()) {
    console.error(`Error message: ${redactConnectionDetails(error)}`);
  }
};

const sanitizeParsedUrl = (url) => {
  const path =
    url.pathname.length > PATH_PREVIEW_LIMIT
      ? `${url.pathname.slice(0, PATH_PREVIEW_LIMIT)}...`
      : url.pathname;

  return `${url.hostname}${path}`;
};

const classifyImageUrl = (value) => {
  if (value === undefined || value === null) {
    return {
      category: "missingEmptyWhereAllowed",
      evidence: "missing imageUrl field",
    };
  }

  if (typeof value !== "string") {
    return {
      category: "malformedUrl",
      evidence: `non-string imageUrl (${typeof value})`,
    };
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return {
      category: "missingEmptyWhereAllowed",
      evidence: "empty imageUrl field",
    };
  }

  const parsedUrl = parseUrl(trimmed);

  if (!parsedUrl) {
    return {
      category: "malformedUrl",
      evidence: "unparseable URL",
    };
  }

  if (parsedUrl.username || parsedUrl.password || parsedUrl.port) {
    return {
      category:
        parsedUrl.hostname === "res.cloudinary.com"
          ? "mismatchedCloudinaryCloudOrPath"
          : "unsupportedHost",
      evidence: sanitizeParsedUrl(parsedUrl),
    };
  }

  const allowedSource = ALLOWED_SOURCES.find((source) => {
    return (
      parsedUrl.protocol === source.protocol &&
      parsedUrl.hostname === source.hostname &&
      parsedUrl.pathname.startsWith(source.pathnamePrefix)
    );
  });

  if (allowedSource) {
    return {
      category: allowedSource.category,
      evidence: sanitizeParsedUrl(parsedUrl),
    };
  }

  if (parsedUrl.hostname === "res.cloudinary.com") {
    return {
      category: "mismatchedCloudinaryCloudOrPath",
      evidence: sanitizeParsedUrl(parsedUrl),
    };
  }

  return {
    category: "unsupportedHost",
    evidence: sanitizeParsedUrl(parsedUrl),
  };
};

const addResult = (bucket, document, classification, label) => {
  bucket.total += 1;
  bucket.counts[classification.category] += 1;

  const examples = bucket.examples[classification.category];
  if (examples.length >= EXAMPLE_LIMIT) {
    return;
  }

  examples.push({
    type: label,
    slug:
      typeof document.slug === "string" && document.slug.trim()
        ? document.slug.trim()
        : "(missing slug)",
    evidence: classification.evidence,
  });
};

const formatTable = (audit) => {
  const lines = [
    "| Category | Articles | Blogs | Collections | Total |",
    "| --- | ---: | ---: | ---: | ---: |",
  ];

  for (const category of CATEGORIES) {
    const articleCount = audit.byType.article.counts[category];
    const blogCount = audit.byType.blog.counts[category];
    const collectionCount = audit.byType.collection.counts[category];
    const total = articleCount + blogCount + collectionCount;

    lines.push(
      `| ${category} | ${articleCount} | ${blogCount} | ${collectionCount} | ${total} |`
    );
  }

  return lines.join("\n");
};

const formatExamples = (audit) => {
  const lines = [];

  for (const category of CATEGORIES) {
    const examplesByType = COLLECTIONS.map(({ label }) => {
      return audit.byType[label].examples[category];
    });
    const examples = [];

    for (let index = 0; examples.length < EXAMPLE_LIMIT; index += 1) {
      let addedForIndex = false;

      for (const typedExamples of examplesByType) {
        if (typedExamples[index]) {
          examples.push(typedExamples[index]);
          addedForIndex = true;
        }

        if (examples.length >= EXAMPLE_LIMIT) {
          break;
        }
      }

      if (!addedForIndex) {
        break;
      }
    }

    lines.push(`\n${category}:`);

    if (examples.length === 0) {
      lines.push("- none");
      continue;
    }

    for (const example of examples.slice(0, EXAMPLE_LIMIT)) {
      lines.push(
        `- ${example.type} slug=${example.slug} image=${example.evidence}`
      );
    }
  }

  return lines.join("\n");
};

const audit = {
  byType: Object.fromEntries(
    COLLECTIONS.map(({ label }) => [label, createBucket()])
  ),
};

let exitCode = 0;
const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 10000,
});

try {
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || undefined);

  for (const { collectionName, label } of COLLECTIONS) {
    const documents = await db
      .collection(collectionName)
      .find(
        {},
        {
          projection: {
            _id: 1,
            slug: 1,
            imageUrl: 1,
          },
        }
      )
      .maxTimeMS(10000)
      .toArray();

    const bucket = audit.byType[label];

    for (const document of documents) {
      addResult(
        bucket,
        document,
        classifyImageUrl(document.imageUrl),
        label
      );
    }
  }

  console.log("# Content Image URL Audit");
  console.log("");
  console.log(
    `Documents audited: ${audit.byType.article.total} articles, ${audit.byType.blog.total} blogs, ${audit.byType.collection.total} collections.`
  );
  console.log("");
  console.log(formatTable(audit));
  console.log("");
  console.log("Examples are sanitized to host/path only; query strings are omitted.");
  console.log(formatExamples(audit));
} catch (error) {
  exitCode = 1;
  logSafeError("Content image URL audit failed.", error);
} finally {
  await client.close().catch((disconnectError) => {
    exitCode = 1;
    logSafeError(
      "Failed to close MongoDB connection after audit.",
      disconnectError
    );
  });
}

process.exitCode = exitCode;
