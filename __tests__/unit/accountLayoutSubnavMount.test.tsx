import { readFileSync } from "fs";
import path from "path";
import React, { Children, Suspense, type ReactElement } from "react";
import AccountLayout from "@/app/account/layout";
import { AccountSubnavLoader } from "@/components/loaders/componentLoaders/AccountSubnavLoader";
import { SubnavSkeleton } from "@/components/modules/navigation/subnav/Subnav";
import dbConnect from "@/lib/db/mongodb";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/components/loaders/componentLoaders/AccountSubnavLoader", () => ({
  AccountSubnavLoader: jest.fn(() => null),
}));

jest.mock("@/components/modules/navigation/subnav/Subnav", () => ({
  SubnavSkeleton: jest.fn(() => null),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const stripJsxComments = (source: string) =>
  source.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

describe("account layout subnav mount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined as never);
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

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
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

    expect(activeSource).toMatch(
      /<Suspense\s+fallback=\{<SubnavSkeleton\s*\/>\}>\s*<AccountSubnavLoader\s*\/>\s*<\/Suspense>/
    );
    expect(source).not.toMatch(/\{\/\*[\s\S]*AccountSubnavLoader[\s\S]*\*\/\}/);
  });
});
