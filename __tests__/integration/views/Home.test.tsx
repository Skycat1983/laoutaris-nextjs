import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Home } from "@/components/views/Home";

jest.mock("@/components/modules/hero/Hero", () => ({
  Hero: () => <div data-testid="home-hero">Hero Mock</div>,
}));

jest.mock("@/components/sections/SubscribeSection", () => ({
  SubscribeSectionSkeleton: () => (
    <section data-testid="subscribe-section-skeleton">
      Subscribe Skeleton
    </section>
  ),
}));

jest.mock(
  "@/components/loaders/sectionLoaders/CollectionSectionLoader",
  () => ({
    CollectionsSectionLoader: () => (
      <section data-testid="prototype-collections-section">
        Collections Section Mock
      </section>
    ),
  })
);

jest.mock("@/components/loaders/sectionLoaders/BiographySectionLoader", () => ({
  BiographySectionLoader: () => (
    <section data-testid="prototype-biography-section">
      Biography Section Mock
    </section>
  ),
}));

jest.mock("@/components/loaders/sectionLoaders/SubscribeSectionLoader", () => ({
  SubscribeSectionLoader: () => (
    <section data-testid="home-subscribe-section">
      Subscribe Section Mock
    </section>
  ),
}));

jest.mock("@/components/loaders/sectionLoaders/BlogSectionLoader", () => ({
  BlogSectionLoader: () => (
    <section data-testid="prototype-blog-section">Blog Section Mock</section>
  ),
}));

jest.mock("@/components/loaders/sectionLoaders/ProjectSectionLoader", () => ({
  ProjectSectionLoader: () => (
    <section data-testid="prototype-project-section">
      Documentary Section Mock
    </section>
  ),
}));

jest.mock("@/components/loaders/sectionLoaders/ShopSectionLoader", () => ({
  ShopSectionLoader: () => (
    <section data-testid="prototype-shop-section">Shop Section Mock</section>
  ),
}));

describe("Home Integration Tests", () => {
  it("keeps the existing hero and subscribe section while rendering migrated homepage sections", async () => {
    render(await Home());

    expect(screen.getByTestId("home-container")).toBeInTheDocument();
    expect(screen.getByTestId("home-hero")).toBeInTheDocument();
    expect(screen.getByTestId("home-redesign-sections")).toBeInTheDocument();
    expect(
      screen.getByTestId("prototype-collections-section")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("prototype-biography-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("home-subscribe-section")).toBeInTheDocument();
    expect(screen.getByTestId("prototype-blog-section")).toBeInTheDocument();
    expect(screen.getByTestId("prototype-project-section")).toBeInTheDocument();
    expect(screen.getByTestId("prototype-shop-section")).toBeInTheDocument();
  });

  it("uses the full-width redesign shell without the old alternating ContentLayout wrappers", async () => {
    render(await Home());

    const sectionShell = screen.getByTestId("home-redesign-sections");

    expect(screen.queryByTestId("home-content-layout")).not.toBeInTheDocument();
    expect(sectionShell).toHaveClass(
      "prototype-home-shell",
      "prototype-home-primary-bg"
    );
    expect(sectionShell).toHaveStyle({
      "--prototype-home-frame-max": "1920px",
      "--prototype-home-heading-scale": "0.9",
      "--prototype-home-alt-bg": "#f5f5f5",
    });
    expect(sectionShell).not.toHaveClass("bg-slate/5");
  });
});
