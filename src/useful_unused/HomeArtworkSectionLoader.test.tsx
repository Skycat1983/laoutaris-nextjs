// In your test file for HomeArtworkSectionLoader:

import React from "react";
import { render, screen } from "@testing-library/react";
import { HomeArtworkSectionLoader } from "../components/loaders/HomeArtworkSectionLoader";

// Fix the mock to match the actual export
jest.mock("@/components/contentSections/HomeArtworkSection", () => ({
  HomeArtworkSection: ({ artworks }: { artworks: any[] }) => (
    <div data-testid="artwork-section-mock">
      {artworks.map((artwork) => (
        <div key={artwork.label}>{artwork.label}</div>
      ))}
    </div>
  ),
}));

// Mock the delay utility
jest.mock("@/utils/debug", () => ({
  delay: jest.fn(() => Promise.resolve()),
}));

describe("HomeArtworkSectionLoader", () => {
  it("renders HomeArtworkSection with the correct artworks", async () => {
    // Render the component
    const element = await HomeArtworkSectionLoader();
    render(element);

    // Verify it renders
    const mockSection = screen.getByTestId("artwork-section-mock");
    expect(mockSection).toBeInTheDocument();

    // Verify some content
    expect(mockSection).toHaveTextContent("Latest");
    expect(mockSection).toHaveTextContent("Featured");
  });
});
