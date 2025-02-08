/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import Home from "@/components/views/Home";

jest.mock("../ui/hero/Hero", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hero">Hero Component</div>,
}));

// Mock other components similarly...

describe("Home Component", () => {
  it("renders without crashing", async () => {
    render(await Home());
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();
  });

  it("contains all expected sections", async () => {
    render(await Home());

    // Check for presence of main sections
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();
    expect(screen.getByTestId("mock-artwork-section")).toBeInTheDocument();
    expect(screen.getByTestId("mock-biography-section")).toBeInTheDocument();
    // ... other sections
  });
});
