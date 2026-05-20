import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReadBlogList } from "@/components/features/adminDashboard/crudForms/read/ReadBlogList";
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
        blogs: jest.fn(),
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

const mockReadBlogs = clientApi.admin.read.blogs as jest.Mock;
const clipboardWriteMock = jest.fn();

Object.defineProperty(global.navigator, "clipboard", {
  value: {
    writeText: clipboardWriteMock,
  },
  configurable: true,
});

const validContentImageUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/content.jpg";

const pageOneBlog = {
  _id: "507f1f77bcf86cd799439101",
  title: "First Page Blog",
  imageUrl: validContentImageUrl,
  displayDate: "2026-05-01T00:00:00.000Z",
  featured: true,
};

const pageTwoBlog = {
  _id: "507f1f77bcf86cd799439102",
  title: "Second Page Blog",
  imageUrl: validContentImageUrl,
  displayDate: "2025-04-01T00:00:00.000Z",
  featured: false,
};

const filteredNotFeaturedBlog = {
  _id: "507f1f77bcf86cd799439103",
  title: "Filtered Not Featured Blog",
  imageUrl: validContentImageUrl,
  displayDate: "2024-03-01T00:00:00.000Z",
  featured: false,
};

const yearFilteredBlog = {
  _id: "507f1f77bcf86cd799439104",
  title: "Year Filtered Blog",
  imageUrl: validContentImageUrl,
  displayDate: "2025-02-01T00:00:00.000Z",
  featured: true,
};

const searchedBlog = {
  _id: "507f1f77bcf86cd799439105",
  title: "Studio Search Blog",
  imageUrl: validContentImageUrl,
  displayDate: "2023-01-01T00:00:00.000Z",
  featured: true,
};

const blogPageResponse = (
  page: number,
  data: Array<typeof pageOneBlog>,
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

function mockPaginatedBlogReads() {
  mockReadBlogs.mockImplementation(
    ({
      page,
      search,
      filter,
    }: {
      page?: number;
      search?: string;
      filter?: { key: string | null; value: string | null };
    } = {}) => {
      if (search === "studio") {
        return Promise.resolve(
          blogPageResponse(1, [searchedBlog], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      if (search === "missing") {
        return Promise.resolve({
          success: false,
          error: "No blogs found",
        });
      }

      if (filter?.key === "featured" && filter.value === "false") {
        return Promise.resolve(
          blogPageResponse(1, [filteredNotFeaturedBlog], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      if (filter?.key === "year" && filter.value === "2025") {
        return Promise.resolve(
          blogPageResponse(1, [yearFilteredBlog], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      return Promise.resolve(
        page === 2
          ? blogPageResponse(2, [pageTwoBlog])
          : blogPageResponse(1, [pageOneBlog])
      );
    }
  );
}

describe("ReadBlogList pagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clipboardWriteMock.mockResolvedValue(undefined);
    mockPaginatedBlogReads();
  });

  it("fetches admin blog pages using route metadata controls", async () => {
    render(<ReadBlogList />);

    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();
    expect(mockReadBlogs).toHaveBeenLastCalledWith({ page: 1, limit: 10 });
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous blog page" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Next blog page" }));

    expect(await screen.findByText("Second Page Blog")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadBlogs).toHaveBeenLastCalledWith({ page: 2, limit: 10 });
    });
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next blog page" })
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Previous blog page" })
    );

    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadBlogs).toHaveBeenLastCalledWith({ page: 1, limit: 10 });
    });
  });

  it("sends selected filters to the route and resets to the first page", async () => {
    render(<ReadBlogList />);

    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next blog page" }));

    expect(await screen.findByText("Second Page Blog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Featured Status" }));
    fireEvent.click(screen.getByRole("option", { name: "Not Featured" }));

    expect(
      await screen.findByText("Filtered Not Featured Blog")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadBlogs).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        filter: { key: "featured", value: "false" },
      });
    });
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.queryByText("Second Page Blog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Year" }));
    fireEvent.click(screen.getByRole("option", { name: "2025" }));

    expect(await screen.findByText("Year Filtered Blog")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadBlogs).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        filter: { key: "year", value: "2025" },
      });
    });
  });

  it("sends search to the route and resets to the first page", async () => {
    render(<ReadBlogList />);

    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next blog page" }));

    expect(await screen.findByText("Second Page Blog")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search blog title or slug" }),
      {
        target: {
          value: "studio",
        },
      }
    );

    expect(await screen.findByText("Studio Search Blog")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadBlogs).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        search: "studio",
      });
    });
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.queryByText("Second Page Blog")).not.toBeInTheDocument();
  });

  it("shows a search-specific no-results state", async () => {
    render(<ReadBlogList />);

    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search blog title or slug" }),
      {
        target: {
          value: "missing",
        },
      }
    );

    expect(
      await screen.findByText("No blogs found for this search.")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadBlogs).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        search: "missing",
      });
    });
    expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();
  });

  it("retains copy, update, and delete actions on searched blog cards", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadBlogList />}
        updateComponent={<OperationProbe label="Update target" />}
        deleteComponent={<OperationProbe label="Delete target" />}
        disabledOperations={["create"]}
      />
    );

    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search blog title or slug" }),
      {
        target: {
          value: "studio",
        },
      }
    );

    expect(await screen.findByText("Studio Search Blog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Copy Studio Search Blog ID" })
    );

    await waitFor(() => {
      expect(clipboardWriteMock).toHaveBeenCalledWith(searchedBlog._id);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Studio Search Blog" })
    );

    expect(
      await screen.findByText(`Update target: ${searchedBlog._id}`)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Read" }));
    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search blog title or slug" }),
      {
        target: {
          value: "studio",
        },
      }
    );
    expect(await screen.findByText("Studio Search Blog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Delete Studio Search Blog" })
    );

    expect(
      await screen.findByText(`Delete target: ${searchedBlog._id}`)
    ).toBeInTheDocument();
  });

  it("retains copy, update, and delete actions on paginated blog cards", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadBlogList />}
        updateComponent={<OperationProbe label="Update target" />}
        deleteComponent={<OperationProbe label="Delete target" />}
        disabledOperations={["create"]}
      />
    );

    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next blog page" }));

    expect(await screen.findByText("Second Page Blog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Copy Second Page Blog ID" })
    );

    await waitFor(() => {
      expect(clipboardWriteMock).toHaveBeenCalledWith(pageTwoBlog._id);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Second Page Blog" })
    );

    expect(
      await screen.findByText(`Update target: ${pageTwoBlog._id}`)
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Update" })).toHaveAttribute(
      "data-state",
      "active"
    );

    fireEvent.click(screen.getByRole("tab", { name: "Read" }));
    expect(await screen.findByText("First Page Blog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next blog page" }));
    expect(await screen.findByText("Second Page Blog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Delete Second Page Blog" })
    );

    expect(
      await screen.findByText(`Delete target: ${pageTwoBlog._id}`)
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Delete" })).toHaveAttribute(
      "data-state",
      "active"
    );
  });

  it("shows operator-visible empty and error states", async () => {
    mockReadBlogs.mockResolvedValueOnce({
      success: false,
      error: "No blogs found",
    });
    const { unmount } = render(<ReadBlogList />);

    expect(await screen.findByText("No blogs found on this page."))
      .toBeInTheDocument();

    unmount();
    mockReadBlogs.mockResolvedValueOnce({
      success: false,
      error: "Failed to fetch blogs",
    });
    render(<ReadBlogList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Failed to fetch blogs"
    );
  });
});
