import { readFileSync } from "fs";
import path from "path";
import React, { Children, Suspense, type ReactElement } from "react";
import AccountLayout, { dynamic } from "@/app/account/layout";
import { AccountSubnavLoader } from "@/components/loaders/componentLoaders/AccountSubnavLoader";
import { SubnavSkeleton } from "@/components/modules/navigation/subnav/Subnav";

jest.mock("@/components/loaders/componentLoaders/AccountSubnavLoader", () => ({
  AccountSubnavLoader: jest.fn(() => null),
}));

jest.mock("@/components/modules/navigation/subnav/Subnav", () => ({
  SubnavSkeleton: jest.fn(() => null),
}));

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const stripJsxComments = (source: string) =>
  source.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

describe("account layout subnav mount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the account subnav loader in Suspense before account content", async () => {
    const accountContent = <div data-testid="account-content" />;
    const layout = (await AccountLayout({
      children: accountContent,
    })) as ReactElement<{ children: React.ReactNode; className: string }>;

    const [subnavBoundary, renderedContent] = Children.toArray(
      layout.props.children
    ) as ReactElement[];
    const fallback = (subnavBoundary.props as { fallback: ReactElement })
      .fallback;
    const subnavLoader = Children.only(
      (subnavBoundary.props as { children: React.ReactNode }).children
    ) as ReactElement;

    expect(dynamic).toBe("force-dynamic");
    expect(layout.type).toBe("section");
    expect(layout.props.className).toBe("p-0 m-0");
    expect(subnavBoundary.type).toBe(Suspense);
    expect(fallback.type).toBe(SubnavSkeleton);
    expect(subnavLoader.type).toBe(AccountSubnavLoader);
    expect(renderedContent.type).toBe("div");
    expect(renderedContent.props).toEqual(accountContent.props);
  });

  it("keeps the account subnav mount active in source", () => {
    const source = readRepoFile("src/app/account/layout.tsx");
    const activeSource = stripJsxComments(source);

    expect(activeSource).toContain('export const dynamic = "force-dynamic";');
    expect(activeSource).not.toMatch(/\bdbConnect\b/);
    expect(activeSource).toMatch(
      /<Suspense\s+fallback=\{<SubnavSkeleton\s*\/>\}>\s*<AccountSubnavLoader\s*\/>\s*<\/Suspense>/
    );
    expect(source).not.toMatch(/\{\/\*[\s\S]*AccountSubnavLoader[\s\S]*\*\/\}/);
  });
});
