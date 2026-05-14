#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const BLOCKED_SERVER_ONLY_ENV_KEYS = Object.freeze([
  "MONGO_URI",
  "MONGODB_URI",
  "NEXTAUTH_SECRET",
  "AUTH_SECRET",
  "JWT_SECRET",
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  "CLOUDINARY_API_SECRET",
  "GITHUB_SECRET",
  "GOOGLE_SECRET",
]);

const SECRET_LIKE_ENV_NAME_PATTERN = /(SECRET|TOKEN|PASSWORD|PRIVATE_KEY)/i;
const NEXT_PUBLIC_PREFIX = "NEXT_PUBLIC_";

// Keep this list intentionally small. Add a name only after documenting why the
// public variable is non-sensitive despite matching the secret-like pattern.
export const ALLOWED_SECRET_LIKE_PUBLIC_ENV_KEYS = Object.freeze([]);

const defaultAllowedPublicEnvKeys = new Set(
  ALLOWED_SECRET_LIKE_PUBLIC_ENV_KEYS
);

const isObjectRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const validateNextConfigEnv = (
  nextConfig,
  { allowedSecretLikePublicEnvKeys = defaultAllowedPublicEnvKeys } = {}
) => {
  const env = nextConfig?.env;

  if (env === undefined) {
    return [];
  }

  if (!isObjectRecord(env)) {
    return [
      {
        key: "env",
        reason: "Next config env must be an object when defined.",
      },
    ];
  }

  const blockedKeys = new Set(BLOCKED_SERVER_ONLY_ENV_KEYS);
  const allowedPublicKeys = new Set(allowedSecretLikePublicEnvKeys);

  return Object.keys(env).flatMap((key) => {
    if (blockedKeys.has(key)) {
      return {
        key,
        reason: "Known server-only secret must not be exposed through Next config env.",
      };
    }

    if (!SECRET_LIKE_ENV_NAME_PATTERN.test(key)) {
      return [];
    }

    if (key.startsWith(NEXT_PUBLIC_PREFIX) && allowedPublicKeys.has(key)) {
      return [];
    }

    if (key.startsWith(NEXT_PUBLIC_PREFIX)) {
      return {
        key,
        reason:
          "Secret-like public env names must be explicitly allowed before use in Next config env.",
      };
    }

    return {
      key,
      reason:
        "Secret-like env names must stay server-only and out of Next config env.",
    };
  });
};

const resolveNextConfigExport = async (configExport) => {
  if (typeof configExport === "function") {
    return configExport("phase-production-build", { defaultConfig: {} });
  }

  return configExport;
};

export const loadNextConfig = async (configPath) => {
  const resolvedConfigPath = path.resolve(process.cwd(), configPath);
  const configModule = await import(pathToFileURL(resolvedConfigPath).href);
  const configExport = configModule.default ?? configModule;

  return resolveNextConfigExport(configExport);
};

export const formatConfigEnvErrors = (errors) =>
  errors
    .map(({ key, reason }) => `- ${key}: ${reason}`)
    .join("\n");

export const runCli = async (argv = process.argv) => {
  const configPath = argv[2] ?? "next.config.mjs";

  try {
    const nextConfig = await loadNextConfig(configPath);
    const errors = validateNextConfigEnv(nextConfig);

    if (errors.length > 0) {
      console.error(
        [
          `Next config env guard failed for ${configPath}.`,
          "Remove these keys from next.config.mjs env:",
          formatConfigEnvErrors(errors),
        ].join("\n")
      );
      return 1;
    }

    console.log(`Next config env guard passed for ${configPath}.`);
    return 0;
  } catch (error) {
    console.error(
      `Next config env guard could not inspect ${configPath}: ${error.message}`
    );
    return 1;
  }
};

const invokedPath = process.argv[1]
  ? path.resolve(process.argv[1])
  : undefined;
const modulePath = fileURLToPath(import.meta.url);

if (invokedPath === modulePath) {
  process.exitCode = await runCli();
}
