/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import { Home } from "./Home";

// ! COMPONENTS
jest.mock("@/components/modules/hero/Hero", () => ({
  __esModule: true,
  Hero: () => <div data-testid="mock-hero">Hero</div>,
}));

jest.mock("@/components/layouts/ContentLayout", () => ({
  __esModule: true,
  ContentLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// ! SKELETONS
// jest.mock("@/components/skeletons/HomeArtworkSectionSkeleton", () => ({
//   __esModule: true,
//   HomeArtworkSectionSkeleton: () => (
//     <div data-testid="artwork-skeleton">Skeleton</div>
//   ),
// }));

jest.mock("@/components/skeletons/HomeCollectionSectionSkeleton", () => ({
  __esModule: true,
  HomeCollectionSectionSkeleton: () => (
    <div data-testid="collection-skeleton">Skeleton</div>
  ),
}));

jest.mock("@/components/skeletons/HomeProjectSectionSkeleton", () => ({
  __esModule: true,
  HomeProjectSectionSkeleton: () => (
    <div data-testid="project-skeleton">Skeleton</div>
  ),
}));

jest.mock("@/components/skeletons/HomeSubscribeSkeleton", () => ({
  __esModule: true,
  HomeSubscribeSectionSkeleton: () => (
    <div data-testid="subscribe-skeleton">Skeleton</div>
  ),
}));

jest.mock("@/components/skeletons/HomeBiographySectionSkeleton", () => ({
  __esModule: true,
  HomeBiographySectionSkeleton: () => (
    <div data-testid="biography-skeleton">Skeleton</div>
  ),
}));

jest.mock("@/components/skeletons/BlogEntriesSkeleton", () => ({
  __esModule: true,
  BlogEntriesSkeleton: () => (
    <div data-testid="blog-entries-skeleton">Skeleton</div>
  ),
}));

// ! LOADERS
// jest.mock(
//   "@/components/loaders/homeArtworkSectionLoader/HomeArtworkSectionLoader",
//   () => ({
//     __esModule: true,
//     HomeArtworkSectionLoader: () => (
//       <div data-testid="artwork-loader">Mock Artwork Loader</div>
//     ),
//   })
// );

jest.mock(
  "@/components/loaders/homeCollectionSectionLoader/HomeCollectionSectionLoader",
  () => ({
    __esModule: true,
    HomeCollectionsSectionLoader: () => (
      <div data-testid="collection-loader">Mock Collection Loader</div>
    ),
  })
);

jest.mock(
  "@/components/loaders/homeProjectSectionLoader/homeProjectSectionLoader",
  () => ({
    __esModule: true,
    HomeProjectSectionLoader: () => (
      <div data-testid="project-loader">Mock Project Loader</div>
    ),
  })
);

jest.mock(
  "@/components/loaders/homeBiographySectionLoader/HomeBiographySectionLoader",
  () => ({
    __esModule: true,
    HomeBiographySectionLoader: () => (
      <div data-testid="biography-loader">Mock Biography Loader</div>
    ),
  })
);

jest.mock(
  "@/components/loaders/homeBlogSectionLoader/HomeBlogSectionLoader",
  () => ({
    __esModule: true,
    HomeBlogSectionLoader: () => (
      <div data-testid="blog-entries-loader">Mock Blog Entries Loader</div>
    ),
  })
);

jest.mock(
  "@/components/loaders/homeSubscribeSectionLoader/HomeSubscribeSectionLoader",
  () => ({
    __esModule: true,
    HomeSubscribeSectionLoader: () => (
      <div data-testid="subscribe-loader">Mock Subscribe Loader</div>
    ),
  })
);

describe("Home Component", () => {
  it("renders without crashing", async () => {
    // Because Home is an async server component, await its execution.
    const HomeComponent = await Home();
    render(HomeComponent);

    // Assert that the hero is rendered.
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();

    // Assert that all mocked loaders are rendered.
    // expect(screen.getByTestId("artwork-loader")).toBeInTheDocument();
    expect(screen.getByTestId("collection-loader")).toBeInTheDocument();
    expect(screen.getByTestId("project-loader")).toBeInTheDocument();
    expect(screen.getByTestId("biography-loader")).toBeInTheDocument();
    expect(screen.getByTestId("subscribe-loader")).toBeInTheDocument();
    expect(screen.getByTestId("blog-entries-loader")).toBeInTheDocument();
  });
});

// // Mock ALL async components and their loaders
// /// <reference types="@testing-library/jest-dom" />
// import React from "react";
// import { render, screen } from "@testing-library/react";
// import Home from "./Home";

// // ! COMPONENTS
// // Mock the Hero component
// jest.mock("@/components/modules/hero/Hero", () => ({
//   __esModule: true,
//   default: () => <div data-testid="mock-hero">Hero</div>,
// }));

// // Mock ContentLayout so that it just renders its children
// jest.mock("@/components/layouts/ContentLayout", () => ({
//   __esModule: true,
//   default: ({ children }: { children: React.ReactNode }) => (
//     <div>{children}</div>
//   ),
// }));

// // ! SKELETONS
// // Mock the fallback skeleton
// jest.mock("@/components/skeletons/HomeArtworkSectionSkeleton", () => ({
//   __esModule: true,
//   default: () => <div data-testid="artwork-skeleton">Skeleton</div>,
// }));
// jest.mock("@/components/skeletons/HomeProjectSectionSkeleton", () => ({
//   __esModule: true,
//   default: () => <div data-testid="project-skeleton">Skeleton</div>,
// }));
// jest.mock("@/components/skeletons/HomeSubscribeSkeleton", () => ({
//   __esModule: true,
//   default: () => <div data-testid="subscribe-skeleton">Skeleton</div>,
// }));
// jest.mock("@/components/skeletons/HomeBiographySectionSkeleton", () => ({
//   __esModule: true,
//   default: () => <div data-testid="biography-skeleton">Skeleton</div>,
// }));
// jest.mock("@/components/skeletons/BlogEntriesSkeleton", () => ({
//   __esModule: true,
//   default: () => <div data-testid="blog-entries-skeleton">Skeleton</div>,
// }));

// // ! LOADERS
// // Mock the artwork loader
// jest.mock(
//   "@/components/loaders/homeArtworkSectionLoader/HomeArtworkSectionLoader",
//   () => ({
//     __esModule: true,
//     default: () => <div data-testid="artwork-loader">Mock Artwork Loader</div>,
//   })
// );

// // Mock the project loader
// jest.mock(
//   "@/components/loaders/homeProjectSectionLoader/homeProjectSectionLoader",
//   () => ({
//     __esModule: true,
//     default: () => <div data-testid="project-loader">Mock Project Loader</div>,
//   })
// );

// // Mock the biography loader
// jest.mock(
//   "@/components/loaders/homeBiographySectionLoader/HomeBiographySectionLoader",
//   () => ({
//     __esModule: true,
//     default: () => (
//       <div data-testid="biography-loader">Mock Biography Loader</div>
//     ),
//   })
// );

// // Mock the blog entries loader
// jest.mock(
//   "@/components/loaders/homeBlogSectionLoader/HomeBlogSectionLoader",
//   () => ({
//     __esModule: true,
//     default: () => (
//       <div data-testid="blog-entries-loader">Mock Blog Entries Loader</div>
//     ),
//   })
// );

// // Mock the subscribe loader
// jest.mock(
//   "@/components/loaders/homeSubscribeSectionLoader/HomeSubscribeSectionLoader",
//   () => ({
//     __esModule: true,
//     default: () => (
//       <div data-testid="subscribe-loader">Mock Subscribe Loader</div>
//     ),
//   })
// );

// describe("Home Component", () => {
//   it("renders without crashing", async () => {
//     // Because Home is an async server component, await its execution.
//     const HomeComponent = await Home();
//     render(HomeComponent);

//     // Assert that the hero is rendered.
//     expect(screen.getByTestId("mock-hero")).toBeInTheDocument();

//     // Assert that our mocked loader is rendered.
//     expect(screen.getByTestId("artwork-loader")).toBeInTheDocument();
//   });
// });
