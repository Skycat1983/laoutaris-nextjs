import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReadArtworkList } from "@/components/features/adminDashboard/crudForms/read/ReadArtworkList";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { clientApi } from "@/lib/api/clientApi";
import type { ReactNode } from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
    className?: string;
    fill?: boolean;
  }) {
    const React = require("react");
    const { fill: _fill, ...imageProps } = props;
    return React.createElement("img", imageProps);
  },
}));

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    admin: {
      read: {
        artworks: jest.fn(),
      },
    },
  },
}));

jest.mock("@/components/shadcn/select", () => {
  const React = require("react");
  const SelectContext = React.createContext({
    disabled: false,
    onValueChange: undefined,
  });

  return {
    Select: ({
      children,
      disabled = false,
      onValueChange,
    }: {
      children: ReactNode;
      disabled?: boolean;
      onValueChange?: (value: string) => void;
    }) =>
      React.createElement(
        SelectContext.Provider,
        { value: { disabled, onValueChange } },
        React.createElement("div", null, children)
      ),
    SelectTrigger: ({ children }: { children: ReactNode }) =>
      React.createElement("div", null, children),
    SelectValue: ({ placeholder }: { placeholder?: string }) =>
      React.createElement("span", null, placeholder),
    SelectContent: ({ children }: { children: ReactNode }) =>
      React.createElement("div", null, children),
    SelectItem: ({
      children,
      value,
    }: {
      children: ReactNode;
      value: string;
    }) => {
      const context = React.useContext(SelectContext);

      return React.createElement(
        "button",
        {
          disabled: context.disabled,
          onClick: () => context.onValueChange?.(value),
          role: "option",
          type: "button",
        },
        children
      );
    },
  };
});

const mockReadArtworks = clientApi.admin.read.artworks as jest.Mock;
const clipboardWriteMock = jest.fn();

Object.defineProperty(global.navigator, "clipboard", {
  value: {
    writeText: clipboardWriteMock,
  },
  configurable: true,
});

const validImage = {
  secure_url:
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/artwork.jpg",
};

const pageOneArtwork = {
  _id: "507f1f77bcf86cd799439501",
  title: "First Page Artwork",
  image: validImage,
  medium: "oil",
  surface: "canvas",
};

const pageTwoArtwork = {
  _id: "507f1f77bcf86cd799439502",
  title: "Second Page Artwork",
  image: validImage,
  medium: "acrylic",
  surface: "paper",
};

const mediumFilteredArtwork = {
  _id: "507f1f77bcf86cd799439503",
  title: "Oil Filtered Artwork",
  image: validImage,
  medium: "oil",
  surface: "canvas",
};

const searchedArtwork = {
  _id: "507f1f77bcf86cd799439504",
  title: "Figure Search Artwork",
  image: validImage,
  medium: "pastel",
  surface: "paper",
};

const combinedSearchFilterArtwork = {
  _id: "507f1f77bcf86cd799439505",
  title: "Oil Figure Artwork",
  image: validImage,
  medium: "oil",
  surface: "canvas",
};

const artworkPageResponse = (
  page: number,
  data: Array<typeof pageOneArtwork>,
  metadata: { total: number; totalPages: number } = {
    total: 100,
    totalPages: 2,
  }
) => ({
  success: true,
  data,
  metadata: {
    page,
    limit: 50,
    total: metadata.total,
    totalPages: metadata.totalPages,
  },
});

function OperationProbe({
  label,
  initialDocumentId = null,
}: {
  label: string;
  initialDocumentId?: string | null;
}) {
  return (
    <div>
      {label}: {initialDocumentId ?? "none"}
    </div>
  );
}

function mockPaginatedArtworkReads() {
  mockReadArtworks.mockImplementation(
    ({
      page,
      search,
      filter,
    }: {
      page?: number;
      search?: string;
      filter?: { key: string | null; value: string | null };
    } = {}) => {
      if (
        search === "figure" &&
        filter?.key === "medium" &&
        filter.value === "oil"
      ) {
        return Promise.resolve(
          artworkPageResponse(1, [combinedSearchFilterArtwork], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      if (search === "figure") {
        return Promise.resolve(
          artworkPageResponse(1, [searchedArtwork], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      if (search === "missing") {
        return Promise.resolve({
          success: false,
          error: "No artworks found",
        });
      }

      if (filter?.key === "medium" && filter.value === "oil") {
        return Promise.resolve(
          artworkPageResponse(1, [mediumFilteredArtwork], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      return Promise.resolve(
        page === 2
          ? artworkPageResponse(2, [pageTwoArtwork])
          : artworkPageResponse(1, [pageOneArtwork])
      );
    }
  );
}

describe("ReadArtworkList pagination, filters, and search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clipboardWriteMock.mockResolvedValue(undefined);
    mockPaginatedArtworkReads();
  });

  it("fetches admin artwork pages using route metadata controls", async () => {
    render(<ReadArtworkList />);

    expect(await screen.findByText("First Page Artwork")).toBeInTheDocument();
    expect(screen.getByText("oil on canvas")).toBeInTheDocument();
    expect(mockReadArtworks).toHaveBeenLastCalledWith({
      page: 1,
      limit: 50,
    });
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous artwork page" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Next artwork page" }));

    expect(await screen.findByText("Second Page Artwork")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArtworks).toHaveBeenLastCalledWith({
        page: 2,
        limit: 50,
      });
    });
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next artwork page" })
    ).toBeDisabled();
  });

  it("sends selected artwork filters to the route, resets page, and supports filter reset", async () => {
    render(<ReadArtworkList />);

    expect(await screen.findByText("First Page Artwork")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next artwork page" }));

    expect(await screen.findByText("Second Page Artwork")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Medium" }));
    fireEvent.click(await screen.findByRole("option", { name: "oil" }));

    expect(await screen.findByText("Oil Filtered Artwork")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArtworks).toHaveBeenLastCalledWith({
        page: 1,
        limit: 50,
        filter: { key: "medium", value: "oil" },
      });
    });
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.queryByText("Second Page Artwork")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "No Filter" }));

    expect(await screen.findByText("First Page Artwork")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArtworks).toHaveBeenLastCalledWith({
        page: 1,
        limit: 50,
      });
    });
  });

  it("sends search with active artwork filters and resets to the first page", async () => {
    render(<ReadArtworkList />);

    expect(await screen.findByText("First Page Artwork")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next artwork page" }));

    expect(await screen.findByText("Second Page Artwork")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Medium" }));
    fireEvent.click(await screen.findByRole("option", { name: "oil" }));

    expect(await screen.findByText("Oil Filtered Artwork")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search artwork title",
      }),
      {
        target: {
          value: "figure",
        },
      }
    );

    expect(await screen.findByText("Oil Figure Artwork")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArtworks).toHaveBeenLastCalledWith({
        page: 1,
        limit: 50,
        search: "figure",
        filter: { key: "medium", value: "oil" },
      });
    });
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.queryByText("Second Page Artwork")).not.toBeInTheDocument();
  });

  it("shows artwork no-results and error states", async () => {
    mockReadArtworks.mockResolvedValueOnce({
      success: false,
      error: "No artworks found",
    });

    const { unmount } = render(<ReadArtworkList />);

    expect(
      await screen.findByText("No artworks found on this page.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();

    unmount();
    mockPaginatedArtworkReads();
    render(<ReadArtworkList />);

    expect(await screen.findByText("First Page Artwork")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search artwork title",
      }),
      {
        target: {
          value: "missing",
        },
      }
    );

    expect(
      await screen.findByText("No artworks found for this search.")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArtworks).toHaveBeenLastCalledWith({
        page: 1,
        limit: 50,
        search: "missing",
      });
    });

    unmount();
    mockReadArtworks.mockResolvedValueOnce({
      success: false,
      error: "Failed to fetch artworks",
    });
    render(<ReadArtworkList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Failed to fetch artworks"
    );
  });

  it("retains copy, update, and delete actions on searched artwork cards", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadArtworkList />}
        updateComponent={<OperationProbe label="Update target" />}
        deleteComponent={<OperationProbe label="Delete target" />}
        disabledOperations={["create"]}
      />
    );

    expect(await screen.findByText("First Page Artwork")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search artwork title",
      }),
      {
        target: {
          value: "figure",
        },
      }
    );

    expect(await screen.findByText("Figure Search Artwork")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Copy Figure Search Artwork ID" })
    );

    await waitFor(() => {
      expect(clipboardWriteMock).toHaveBeenCalledWith(searchedArtwork._id);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Figure Search Artwork" })
    );

    expect(
      await screen.findByText(`Update target: ${searchedArtwork._id}`)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Read" }));
    expect(await screen.findByText("First Page Artwork")).toBeInTheDocument();
    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search artwork title",
      }),
      {
        target: {
          value: "figure",
        },
      }
    );
    expect(await screen.findByText("Figure Search Artwork")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Delete Figure Search Artwork" })
    );

    expect(
      await screen.findByText(`Delete target: ${searchedArtwork._id}`)
    ).toBeInTheDocument();
  });
});
