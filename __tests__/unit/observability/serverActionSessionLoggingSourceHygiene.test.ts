import { readFileSync } from "fs";
import path from "path";

const scopedServerActionSessionFiles = [
  "src/lib/actions/submitSubscription.ts",
  "src/lib/actions/updateUserFavourites.ts",
  "src/lib/actions/updateUserWatchlist.ts",
  "src/lib/session/getUserFromSession.ts",
];

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("server action and session helper logging source hygiene", () => {
  it("keeps the T-128 action/session slice free of direct console error and warning calls", () => {
    const offenders = scopedServerActionSessionFiles.flatMap((sourceFile) => {
      const source = readRepoFile(sourceFile);
      const matches = source.match(/console\.(error|warn)\s*\(/g) ?? [];

      return matches.map((match) => `${sourceFile}: ${match}`);
    });

    expect(offenders).toEqual([]);
  });

  it("routes retained server logging through the structured logger helper", () => {
    for (const sourceFile of scopedServerActionSessionFiles) {
      const source = readRepoFile(sourceFile);

      expect(source).toContain("createServerLogger");
    }
  });
});
