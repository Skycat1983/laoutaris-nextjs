import { readFileSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("public shell auth boundaries", () => {
  it("keeps root layout free of global DB and server session work", () => {
    const source = readRepoFile("src/app/layout.tsx");

    expect(source).not.toMatch(/getServerSession/);
    expect(source).not.toMatch(/authOptions/);
    expect(source).not.toMatch(/dbConnect/);
  });
});
