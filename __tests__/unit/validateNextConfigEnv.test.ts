import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { spawnSync } from "child_process";

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, "scripts/validate-next-config-env.mjs");
const tempDirs: string[] = [];

const runGuard = (configPath: string) =>
  spawnSync(process.execPath, [scriptPath, configPath], {
    cwd: repoRoot,
    encoding: "utf8",
  });

const writeTempConfig = (source: string) => {
  const tempDir = mkdtempSync(path.join(tmpdir(), "next-config-env-guard-"));
  tempDirs.push(tempDir);
  const configPath = path.join(tempDir, "next.config.mjs");
  writeFileSync(configPath, source);
  return configPath;
};

afterAll(() => {
  tempDirs.forEach((tempDir) => {
    rmSync(tempDir, { recursive: true, force: true });
  });
});

describe("validate-next-config-env", () => {
  it("passes the current next.config.mjs", () => {
    const result = runGuard("next.config.mjs");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Next config env guard passed");
    expect(result.stderr).toBe("");
  });

  it.each([
    "MONGO_URI",
    "MONGODB_URI",
    "NEXTAUTH_SECRET",
    "AUTH_SECRET",
    "JWT_SECRET",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
    "CLOUDINARY_API_SECRET",
    "GITHUB_SECRET",
    "GOOGLE_SECRET",
  ])("fails when next.config.mjs exposes %s", (key) => {
    const configPath = writeTempConfig(`
      export default {
        env: {
          ${JSON.stringify(key)}: process.env[${JSON.stringify(key)}],
        },
      };
    `);

    const result = runGuard(configPath);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Next config env guard failed");
    expect(result.stderr).toContain(key);
  });

  it.each([
    "DATABASE_PASSWORD",
    "SERVICE_PRIVATE_KEY",
    "CMS_TOKEN",
    "LEGACY_SECRET",
  ])("fails for future secret-like env name %s", (key) => {
    const configPath = writeTempConfig(`
      export default {
        env: {
          ${JSON.stringify(key)}: process.env[${JSON.stringify(key)}],
        },
      };
    `);

    const result = runGuard(configPath);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(key);
    expect(result.stderr).toContain("Secret-like env names");
  });

  it.each([
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "NEXT_PUBLIC_CLOUDINARY_API_KEY",
  ])("allows public env name %s when it is not secret-like", (key) => {
    const configPath = writeTempConfig(`
      export default {
        env: {
          ${JSON.stringify(key)}: process.env[${JSON.stringify(key)}],
        },
      };
    `);

    const result = runGuard(configPath);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  });

  it("fails secret-like NEXT_PUBLIC env names unless they are explicitly allowed", () => {
    const key = "NEXT_PUBLIC_ANALYTICS_TOKEN";
    const configPath = writeTempConfig(`
      export default {
        env: {
          ${JSON.stringify(key)}: process.env[${JSON.stringify(key)}],
        },
      };
    `);

    const result = runGuard(configPath);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(key);
    expect(result.stderr).toContain("explicitly allowed");
  });
});
