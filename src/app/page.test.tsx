import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";
import { waitFor } from "@testing-library/react";

//! jest.mock(moduleName, factory);
// moduleName: The name of the module to mock (the path to the file).
// factory: A function that returns the mock.
jest.mock("../lib/server/article/data-fetching/fetchArticles", () => ({
  fetchArticles: jest.fn(async () => ({
    success: true,
    data: [
      {
        _id: "664893f0823f45cf9d3495af",
        title: "Early Years",
        subtitle: "First Encounters with Art",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361077/artwork/mv4jqdtm2dki3cdkxmwe.jpg",
        slug: "early-years",
      },
      {
        _id: "66489a63ab497e6f2ecca058",
        title: "Meeting Beryl",
        subtitle: "Legacy of Love and Loss",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg",
        slug: "meeting-beryl",
      },
      {
        _id: "6648af1cab497e6f2ecca092",
        title: "Later Years",
        subtitle: "Resignation and Disappointment",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713358358/artwork/lfvalatlv33x5sghnbky.jpg",
        slug: "later-years",
      },
      {
        _id: "66c4c8de721b32fdcc34e28e",
        title: "Ethos",
        subtitle: "Old-Fashioned in a New World",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361219/artwork/sp1r7xxdcphbno8f8b8n.jpg",
        slug: "ethos",
      },
      {
        _id: "66584dfe2768ac3db7c249d2",
        title: "Obituary",
        subtitle: "Joseph Laoutaris: 1935 - 2022",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713360414/artwork/fvcsx991quwdwnqdb2va.jpg",
        slug: "obituary",
      },
    ],
    statusCode: 200,
  })),
}));

jest.mock("@/components/ui/hero/Hero", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hero">Mock Hero</div>,
}));

// ! V1 works
describe("Home Page", () => {
  it("renders the page layout with the correct structure", async () => {
    // Render the asynchronous component
    render(await Home());

    const heroContent = screen.getByTestId("mock-hero");
    expect(heroContent).toBeInTheDocument();

    // Check for biography content
    const artworkContent = screen.getByTestId("artwork-content");
    expect(artworkContent).toBeInTheDocument();
    const projectContent = screen.getByTestId("project-content");
    expect(projectContent).toBeInTheDocument();
    // expect(biographyContent).toHaveTextContent("BiographyContent");
  });
});
