import { readFileSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("public route fallback patterns", () => {
  it("documents accepted route fallback ownership by route type", () => {
    const source = readRepoFile(
      "docs/architecture/rendering-and-data-fetching.md"
    );

    expect(source).toContain("## Public Route Loading And Fallback Pattern");
    expect(source).toContain("App Router route-level `loading.tsx` files");
    expect(source).toContain("Public detail primary-content `Suspense`");
    expect(source).toContain("Route layout navigation and pagination");
    expect(source).toContain("Invisible JSON-LD and metadata");
    expect(source).toContain("fallback={null}` is intentional only");
    expect(source).toContain("Client follow-up loading states");
    expect(source).toMatch(/Generic\s+user-facing loading copy is not/);
  });

  it("keeps the project aims image fallback neutral and layout-preserving", () => {
    const source = readRepoFile("src/app/project/aims/page.tsx");

    expect(source).not.toMatch(/bg-blue-500/);
    expect(source).not.toMatch(/Loading\.\.\./);
    expect(source).toContain("const AimsDesktopImageFallback");
    expect(source).toContain("fallback={<AimsDesktopImageFallback />}");
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain("min-h-[560px]");
    expect(source).toContain("bg-slate-100");
  });
});
