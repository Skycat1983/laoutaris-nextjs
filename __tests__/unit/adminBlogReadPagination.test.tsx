import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReadBlogList } from "@/components/features/adminDashboard/crudForms/read/ReadBlogList";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { clientApi } from "@/lib/api/clientApi";

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

const blogPageResponse = (
  page: number,
  data: Array<typeof pageOneBlog>
) => ({
  success: true,
  data,
  metadata: {
    page,
    limit: 10,
    total: 20,
    totalPages: 2,
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
  mockReadBlogs.mockImplementation(({ page }: { page?: number } = {}) =>
    Promise.resolve(
      page === 2
        ? blogPageResponse(2, [pageTwoBlog])
        : blogPageResponse(1, [pageOneBlog])
    )
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
