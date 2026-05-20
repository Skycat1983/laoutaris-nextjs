import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { readFileSync } from "fs";
import path from "path";
import Breadcrumbs from "@/components/modules/navigation/breadcrumbs/Breadcrumbs";
import {
  usePathname,
  useSearchParams,
  useSelectedLayoutSegments,
} from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  useSelectedLayoutSegments: jest.fn(),
}));

jest.mock("@/components/shadcn/scroll-area", () => ({
  ScrollArea: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  ScrollBar: () => null,
}));

const mockUsePathname = usePathname as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseSelectedLayoutSegments = useSelectedLayoutSegments as jest.Mock;

const artworkId = "65f1d9f1093b3e3a7c123456";

const readSource = (sourcePath: string) =>
  readFileSync(path.join(process.cwd(), sourcePath), "utf8");

const setRoute = (pathname: string, segments: string[]) => {
  mockUsePathname.mockReturnValue(pathname);
  mockUseSelectedLayoutSegments.mockReturnValue(segments);
  mockUseSearchParams.mockReturnValue({
    get: jest.fn().mockReturnValue(null),
  });
};

const addBreadcrumbJsonLd = (
  items: Array<{
    name: string;
    path: string;
  }>
) => {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://example.test${item.path}`,
    })),
  });
  document.body.appendChild(script);
};

describe("visible breadcrumbs", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    document
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((script) => script.remove());
  });

  it("uses server-rendered breadcrumb JSON-LD for artwork detail labels", async () => {
    setRoute(`/artwork/${artworkId}`, ["artwork", artworkId]);

    render(<Breadcrumbs />);

    expect(screen.queryByText("artworkId")).not.toBeInTheDocument();
    expect(screen.queryByText(artworkId)).not.toBeInTheDocument();

    addBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Artwork", path: "/artwork" },
      { name: "Blue Figure", path: `/artwork/${artworkId}` },
    ]);

    const artworkBreadcrumb = await screen.findByRole("link", {
      name: "Blue Figure",
    });

    expect(artworkBreadcrumb).toHaveAttribute("href", `/artwork/${artworkId}`);
    expect(screen.queryByText("artworkId")).not.toBeInTheDocument();
    expect(screen.queryByText(artworkId)).not.toBeInTheDocument();
  });

  it("uses server-rendered breadcrumb JSON-LD for slug detail labels", async () => {
    setRoute("/blog/gallery-news", ["blog", "gallery-news"]);
    addBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: "Gallery News", path: "/blog/gallery-news" },
    ]);

    render(<Breadcrumbs />);

    const postBreadcrumb = await screen.findByRole("link", {
      name: "Gallery News",
    });

    expect(postBreadcrumb).toHaveAttribute("href", "/blog/gallery-news");
    expect(screen.queryByText("gallery-news")).not.toBeInTheDocument();
  });

  it("keeps visible breadcrumb labels sourced from page JSON-LD without client fetching", () => {
    const source = readSource(
      "src/components/modules/navigation/breadcrumbs/Breadcrumbs.tsx"
    );

    expect(source).toContain('script[type="application/ld+json"]');
    expect(source).not.toMatch(/fetch\s*\(/);
    expect(source).not.toContain('"artworkId"');
    expect(source).not.toContain(">artworkId<");
  });
});
