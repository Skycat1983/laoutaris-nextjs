import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";

const sourceFilePattern = /\.(?:cjs|js|jsx|mjs|ts|tsx)$/;

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const listRepoSourceFiles = (relativeDir: string): string[] => {
  const absoluteDir = path.join(process.cwd(), relativeDir);

  return readdirSync(absoluteDir).flatMap((entry) => {
    const absolutePath = path.join(absoluteDir, entry);
    const relativePath = path.join(relativeDir, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return listRepoSourceFiles(relativePath);
    }

    return sourceFilePattern.test(entry) ? [relativePath] : [];
  });
};

describe("console.log source hygiene", () => {
  it("keeps src source files free of direct or commented console.log calls", () => {
    for (const sourceFile of listRepoSourceFiles("src")) {
      expect(readRepoFile(sourceFile)).not.toMatch(/console\.log\s*\(/);
    }
  });
});
