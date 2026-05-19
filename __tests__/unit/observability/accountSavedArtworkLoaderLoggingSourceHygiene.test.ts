import { readFileSync } from "fs";
import path from "path";

const scopedAccountSavedArtworkLoaderFiles = [
  "src/components/loaders/viewLoaders/FavouritedArtworkLoader.tsx",
];

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("account saved artwork loader logging source hygiene", () => {
  it("keeps the T-129 account saved-artwork loader free of direct console error and warning calls", () => {
    const offenders = scopedAccountSavedArtworkLoaderFiles.flatMap((sourceFile) => {
      const source = readRepoFile(sourceFile);
      const matches = source.match(/console\.(error|warn)\s*\(/g) ?? [];

      return matches.map((match) => `${sourceFile}: ${match}`);
    });

    expect(offenders).toEqual([]);
  });

  it("routes retained server logging through the structured logger helper", () => {
    for (const sourceFile of scopedAccountSavedArtworkLoaderFiles) {
      const source = readRepoFile(sourceFile);

      expect(source).toContain("createServerLogger");
      expect(source).toContain("loader.account.favourite_artwork.failed");
    }
  });
});
