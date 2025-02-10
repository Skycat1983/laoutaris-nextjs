/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import Home from "./Home";

// Mock all components used in Home
jest.mock("../../ui/hero/Hero", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hero">Hero Component</div>,
}));

jest.mock("../../homepageSections/HomeArtworkSection", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-artwork-section">Artwork Section</div>,
}));

jest.mock("../../loaders/HomeBiographySectionLoader", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-biography-section">Biography Section</div>
  ),
}));

// Mock other components used in Home
jest.mock("../../layouts/ContentLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-content-layout">{children}</div>
  ),
}));

jest.mock("../../homepageSections/HomeSubscribeSection", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-subscribe-section">Subscribe Section</div>
  ),
}));

jest.mock("../../loaders/HomeBlogSectionLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-blog-section">Blog Section</div>,
}));

// Group related tests together
describe("Home Component", () => {
  // Test that verifies Home renders without errors
  it("renders without crashing", async () => {
    // Render the Home component in a test environment
    render(await Home());
    // If Home stops including Hero, this will fail because mock-hero won't be found\
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();
  });

  // Test that verifies all required sections are present
  it("contains all expected sections", async () => {
    render(await Home());

    // These will fail if Home stops rendering any of these sections
    // Even though we're using mocks, the test verifies the structure of Home
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();
    expect(screen.getByTestId("mock-artwork-section")).toBeInTheDocument();
    expect(screen.getByTestId("mock-biography-section")).toBeInTheDocument();
    expect(screen.getByTestId("mock-subscribe-section")).toBeInTheDocument();
    expect(screen.getByTestId("mock-blog-section")).toBeInTheDocument();
  });
});
