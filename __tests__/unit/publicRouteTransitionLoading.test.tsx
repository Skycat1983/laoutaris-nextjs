import React, { Suspense, lazy, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import SearchLoading from "@/app/search/loading";
import Searchbar from "@/components/elements/inputs/Searchbar";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();

const createDeferredRoute = () => {
  let resolveRoute!: (module: {
    default: React.ComponentType;
  }) => void;
  const routePromise = new Promise<{ default: React.ComponentType }>(
    (resolve) => {
      resolveRoute = resolve;
    }
  );

  return {
    Route: lazy(() => routePromise),
    resolveRoute,
  };
};

function SearchRouteTransitionHarness({
  Route,
}: {
  Route: React.ComponentType;
}) {
  const [href, setHref] = useState<string | null>(null);

  mockUseRouter.mockReturnValue({
    push: (nextHref: string) => {
      mockPush(nextHref);
      setHref(nextHref);
    },
  });

  return (
    <>
      <Searchbar />
      {href?.startsWith("/search") ? (
        <Suspense fallback={<SearchLoading />}>
          <Route />
        </Suspense>
      ) : null}
    </>
  );
}

describe("public route transition loading behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the route-local search loading shell during a delayed search transition", async () => {
    const { Route, resolveRoute } = createDeferredRoute();

    render(<SearchRouteTransitionHarness Route={Route} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
      target: { value: "  red figure  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit search" }));

    expect(mockPush).toHaveBeenCalledWith("/search?q=red+figure");
    expect(
      await screen.findByRole("status", { name: "Loading search results" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: 'Search Results for "red figure"',
      })
    ).not.toBeInTheDocument();

    await act(async () => {
      resolveRoute({
        default: () => (
          <main>
            <h1>{'Search Results for "red figure"'}</h1>
          </main>
        ),
      });
    });

    expect(
      await screen.findByRole("heading", {
        name: 'Search Results for "red figure"',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: "Loading search results" })
    ).not.toBeInTheDocument();
  });
});
