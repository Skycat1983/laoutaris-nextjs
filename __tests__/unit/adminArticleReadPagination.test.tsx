import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReadArticleList } from "@/components/features/adminDashboard/crudForms/read/ReadArticleList";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { clientApi } from "@/lib/api/clientApi";
import type { ReactNode } from "react";

jest.setTimeout(20000);

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
        articles: jest.fn(),
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

const mockReadArticles = clientApi.admin.read.articles as jest.Mock;
const clipboardWriteMock = jest.fn();

Object.defineProperty(global.navigator, "clipboard", {
  value: {
    writeText: clipboardWriteMock,
  },
  configurable: true,
});

const validContentImageUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/content.jpg";

const pageOneArticle = {
  _id: "507f1f77bcf86cd799439401",
  title: "First Page Article",
  imageUrl: validContentImageUrl,
  section: "artwork",
  overlayColour: "white",
};

const pageTwoArticle = {
  _id: "507f1f77bcf86cd799439402",
  title: "Second Page Article",
  imageUrl: validContentImageUrl,
  section: "project",
  overlayColour: "black",
};

const sectionFilteredArticle = {
  _id: "507f1f77bcf86cd799439403",
  title: "Biography Filtered Article",
  imageUrl: validContentImageUrl,
  section: "biography",
  overlayColour: "white",
};

const overlayFilteredArticle = {
  _id: "507f1f77bcf86cd799439404",
  title: "Black Overlay Article",
  imageUrl: validContentImageUrl,
  section: "project",
  overlayColour: "black",
};

const searchedArticle = {
  _id: "507f1f77bcf86cd799439405",
  title: "Studio Search Article",
  imageUrl: validContentImageUrl,
  section: "biography",
  overlayColour: "black",
};

const combinedSearchFilterArticle = {
  _id: "507f1f77bcf86cd799439406",
  title: "Biography Studio Article",
  imageUrl: validContentImageUrl,
  section: "biography",
  overlayColour: "white",
};

const articlePageResponse = (
  page: number,
  data: Array<typeof pageOneArticle>,
  metadata: { total: number; totalPages: number } = {
    total: 20,
    totalPages: 2,
  }
) => ({
  success: true,
  data,
  metadata: {
    page,
    limit: 10,
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

function mockPaginatedArticleReads() {
  mockReadArticles.mockImplementation(
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
        search === "studio" &&
        filter?.key === "section" &&
        filter.value === "biography"
      ) {
        return Promise.resolve(
          articlePageResponse(1, [combinedSearchFilterArticle], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      if (search === "studio") {
        return Promise.resolve(
          articlePageResponse(1, [searchedArticle], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      if (search === "missing") {
        return Promise.resolve({
          success: false,
          error: "No articles found",
        });
      }

      if (filter?.key === "section" && filter.value === "biography") {
        return Promise.resolve(
          articlePageResponse(1, [sectionFilteredArticle], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      if (filter?.key === "overlayColour" && filter.value === "black") {
        return Promise.resolve(
          articlePageResponse(1, [overlayFilteredArticle], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      return Promise.resolve(
        page === 2
          ? articlePageResponse(2, [pageTwoArticle])
          : articlePageResponse(1, [pageOneArticle])
      );
    }
  );
}

describe("ReadArticleList pagination, filters, and search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clipboardWriteMock.mockResolvedValue(undefined);
    mockPaginatedArticleReads();
  });

  it("fetches admin article pages using route metadata controls", async () => {
    render(<ReadArticleList />);

    expect(await screen.findByText("First Page Article")).toBeInTheDocument();
    expect(mockReadArticles).toHaveBeenLastCalledWith({
      page: 1,
      limit: 10,
    });
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous article page" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Next article page" }));

    expect(await screen.findByText("Second Page Article")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArticles).toHaveBeenLastCalledWith({
        page: 2,
        limit: 10,
      });
    });
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next article page" })
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Previous article page" })
    );

    expect(await screen.findByText("First Page Article")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArticles).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  it("sends selected article filters to the route and resets to the first page", async () => {
    render(<ReadArticleList />);

    expect(await screen.findByText("First Page Article")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next article page" }));

    expect(await screen.findByText("Second Page Article")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Section" }));
    fireEvent.click(await screen.findByRole("option", { name: "biography" }));

    expect(
      await screen.findByText("Biography Filtered Article")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArticles).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        filter: { key: "section", value: "biography" },
      });
    });
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.queryByText("Second Page Article")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Overlay Colour" }));
    fireEvent.click(await screen.findByRole("option", { name: "black" }));

    expect(await screen.findByText("Black Overlay Article")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArticles).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        filter: { key: "overlayColour", value: "black" },
      });
    });
  });

  it("sends search with active article filters and resets to the first page", async () => {
    render(<ReadArticleList />);

    expect(await screen.findByText("First Page Article")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next article page" }));

    expect(await screen.findByText("Second Page Article")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Section" }));
    fireEvent.click(await screen.findByRole("option", { name: "biography" }));

    expect(
      await screen.findByText("Biography Filtered Article")
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search article title or slug",
      }),
      {
        target: {
          value: "studio",
        },
      }
    );

    expect(
      await screen.findByText("Biography Studio Article")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArticles).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        search: "studio",
        filter: { key: "section", value: "biography" },
      });
    });
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.queryByText("Second Page Article")).not.toBeInTheDocument();
  });

  it("shows article no-results and error states", async () => {
    mockReadArticles.mockResolvedValueOnce({
      success: false,
      error: "No articles found",
    });

    const { unmount } = render(<ReadArticleList />);

    expect(
      await screen.findByText("No articles found on this page.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();

    unmount();
    mockPaginatedArticleReads();
    render(<ReadArticleList />);

    expect(await screen.findByText("First Page Article")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search article title or slug",
      }),
      {
        target: {
          value: "missing",
        },
      }
    );

    expect(
      await screen.findByText("No articles found for this search.")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadArticles).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        search: "missing",
      });
    });
    expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();

    unmount();
    mockReadArticles.mockResolvedValueOnce({
      success: false,
      error: "Failed to fetch articles",
    });
    render(<ReadArticleList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Failed to fetch articles"
    );
  });

  it("retains copy, update, and delete actions on searched article cards", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadArticleList />}
        updateComponent={<OperationProbe label="Update target" />}
        deleteComponent={<OperationProbe label="Delete target" />}
        disabledOperations={["create"]}
      />
    );

    expect(await screen.findByText("First Page Article")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search article title or slug",
      }),
      {
        target: {
          value: "studio",
        },
      }
    );

    expect(await screen.findByText("Studio Search Article")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Copy Studio Search Article ID" })
    );

    await waitFor(() => {
      expect(clipboardWriteMock).toHaveBeenCalledWith(searchedArticle._id);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Studio Search Article" })
    );

    expect(
      await screen.findByText(`Update target: ${searchedArticle._id}`)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Read" }));
    expect(await screen.findByText("First Page Article")).toBeInTheDocument();
    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search article title or slug",
      }),
      {
        target: {
          value: "studio",
        },
      }
    );
    expect(await screen.findByText("Studio Search Article")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Delete Studio Search Article" })
    );

    expect(
      await screen.findByText(`Delete target: ${searchedArticle._id}`)
    ).toBeInTheDocument();
  });
});
