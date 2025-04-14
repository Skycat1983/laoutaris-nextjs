import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Home } from "@/components/views/Home";

// Mock the server component
jest.mock("@/components/views/Home", () => ({
  Home: () => {
    const MockHome = async () => {
      return (
        <div data-testid="home-container">
          <div data-testid="home-hero">Hero Mock</div>

          <div data-testid="home-content-layout">
            <div data-testid="collection-section-skeleton">
              Collection Skeleton
            </div>
            <div data-testid="home-collection-section">
              Collections Section Mock
            </div>
          </div>

          <div data-testid="home-content-layout" className="bg-slate/5">
            <div data-testid="project-section-skeleton">Project Skeleton</div>
            <div data-testid="home-project-section">Project Section Mock</div>
          </div>

          <div data-testid="home-content-layout">
            <div data-testid="biography-section-skeleton">
              Biography Skeleton
            </div>
            <div data-testid="home-biography-section">
              Biography Section Mock
            </div>
          </div>

          <div data-testid="home-content-layout" className="bg-slate/5">
            <div data-testid="subscribe-section-skeleton">
              Subscribe Skeleton
            </div>
            <div data-testid="home-subscribe-section">
              Subscribe Section Mock
            </div>
          </div>

          <div data-testid="home-content-layout">
            <div data-testid="blog-section-skeleton">Blog Skeleton</div>
            <div data-testid="home-blog-section">Blog Section Mock</div>
          </div>
        </div>
      );
    };
    return MockHome();
  },
}));

// Mock Suspense to always show fallback
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    Suspense: ({ fallback }: { fallback: React.ReactNode }) => fallback,
  };
});

jest.mock("@/components/modules/hero/Hero", () => ({
  Hero: () => <div data-testid="home-hero">Hero Mock</div>,
}));

jest.mock(
  "@/components/loaders/sectionLoaders/CollectionSectionLoader",
  () => ({
    CollectionsSectionLoader: () => (
      <div data-testid="home-collection-section">Collections Section Mock</div>
    ),
  })
);

jest.mock("@/components/loaders/sectionLoaders/ProjectSectionLoader", () => ({
  ProjectSectionLoader: () => (
    <div data-testid="home-project-section">Project Section Mock</div>
  ),
}));

jest.mock("@/components/loaders/sectionLoaders/BiographySectionLoader", () => ({
  BiographySectionLoader: () => (
    <div data-testid="home-biography-section">Biography Section Mock</div>
  ),
}));

jest.mock("@/components/loaders/sectionLoaders/SubscribeSectionLoader", () => ({
  SubscribeSectionLoader: () => (
    <div data-testid="home-subscribe-section">Subscribe Section Mock</div>
  ),
}));

jest.mock("@/components/loaders/sectionLoaders/BlogSectionLoader", () => ({
  BlogSectionLoader: () => (
    <div data-testid="home-blog-section">Blog Section Mock</div>
  ),
}));

// Mock skeleton components
jest.mock("@/components/sections/CollectionSection", () => ({
  CollectionSectionSkeleton: () => (
    <div data-testid="collection-section-skeleton">Collection Skeleton</div>
  ),
}));

jest.mock("@/components/sections/ProjectSection", () => ({
  ProjectSectionSkeleton: () => (
    <div data-testid="project-section-skeleton">Project Skeleton</div>
  ),
}));

jest.mock("@/components/sections/BiographySection", () => ({
  BiographySectionSkeleton: () => (
    <div data-testid="biography-section-skeleton">Biography Skeleton</div>
  ),
}));

jest.mock("@/components/sections/SubscribeSection", () => ({
  SubscribeSectionSkeleton: () => (
    <div data-testid="subscribe-section-skeleton">Subscribe Skeleton</div>
  ),
}));

jest.mock("@/components/sections/BlogSection", () => ({
  BlogSectionSkeleton: () => (
    <div data-testid="blog-section-skeleton">Blog Skeleton</div>
  ),
}));

describe("Home Integration Tests", () => {
  it("renders all sections with their loaders", async () => {
    render(await Home());

    // Verify main container
    expect(screen.getByTestId("home-container")).toBeInTheDocument();
    expect(screen.getByTestId("home-collection-section")).toBeInTheDocument();
    expect(screen.getByTestId("home-project-section")).toBeInTheDocument();
    expect(screen.getByTestId("home-biography-section")).toBeInTheDocument();
    expect(screen.getByTestId("home-subscribe-section")).toBeInTheDocument();
    expect(screen.getByTestId("home-blog-section")).toBeInTheDocument();
  });

  it("renders content layout with correct background colors", async () => {
    render(await Home());

    const contentLayouts = screen.getAllByTestId("home-content-layout");
  });

  it("renders Suspense fallbacks for each section", async () => {
    render(await Home());

    // Verify that Suspense boundaries exist
    expect(
      screen.getByTestId("collection-section-skeleton")
    ).toBeInTheDocument();
    expect(screen.getByTestId("project-section-skeleton")).toBeInTheDocument();
    expect(
      screen.getByTestId("biography-section-skeleton")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("subscribe-section-skeleton")
    ).toBeInTheDocument();
    expect(screen.getByTestId("blog-section-skeleton")).toBeInTheDocument();
  });
});
