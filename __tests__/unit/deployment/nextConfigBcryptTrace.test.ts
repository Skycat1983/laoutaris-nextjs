import { existsSync } from "fs";
import path from "path";
import { spawnSync } from "child_process";

const repoRoot = process.cwd();

const readOutputFileTracingIncludes = () => {
  const result = spawnSync(
    process.execPath,
    [
      "-e",
      "import('./next.config.mjs').then(({ default: config }) => console.log(JSON.stringify(config.experimental?.outputFileTracingIncludes ?? {})))",
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
    }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout);
  }

  return JSON.parse(result.stdout) as Record<string, string[]>;
};

describe("Next production file tracing", () => {
  it("ships bcrypt native prebuilds with server route bundles", () => {
    const includes = readOutputFileTracingIncludes();

    expect(includes["/**"]).toContain("node_modules/bcrypt/prebuilds/**/*");
  });

  it("has the Linux glibc bcrypt prebuild required by Vercel Node functions", () => {
    expect(
      existsSync(
        path.join(
          repoRoot,
          "node_modules/bcrypt/prebuilds/linux-x64/bcrypt.glibc.node"
        )
      )
    ).toBe(true);
  });
});
