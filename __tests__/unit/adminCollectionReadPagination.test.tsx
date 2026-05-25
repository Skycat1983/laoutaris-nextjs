import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReadCollectionList } from "@/components/features/adminDashboard/crudForms/read/ReadCollectionList";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { clientApi } from "@/lib/api/clientApi";

jest.setTimeout(20000);

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    admin: {
      read: {
        collections: jest.fn(),
      },
    },
  },
}));

const mockReadCollections = clientApi.admin.read.collections as jest.Mock;
const clipboardWriteMock = jest.fn();

Object.defineProperty(global.navigator, "clipboard", {
  value: {
    writeText: clipboardWriteMock,
  },
  configurable: true,
});

const pageOneCollection = {
  _id: "507f1f77bcf86cd799439201",
  title: "First Page Collection",
  summary: "First page summary",
  artworks: [{ _id: "507f1f77bcf86cd799439301" }],
};

const pageTwoCollection = {
  _id: "507f1f77bcf86cd799439202",
  title: "Second Page Collection",
  summary: "Second page summary",
  artworks: [
    { _id: "507f1f77bcf86cd799439302" },
    { _id: "507f1f77bcf86cd799439303" },
  ],
};

const searchedCollection = {
  _id: "507f1f77bcf86cd799439203",
  title: "Archive Search Collection",
  summary: "Search result summary",
  artworks: [{ _id: "507f1f77bcf86cd799439304" }],
};

const collectionPageResponse = (
  page: number,
  data: Array<typeof pageOneCollection>,
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

function mockPaginatedCollectionReads() {
  mockReadCollections.mockImplementation(
    ({
      page,
      search,
    }: {
      page?: number;
      search?: string;
    } = {}) => {
      if (search === "archive") {
        return Promise.resolve(
          collectionPageResponse(1, [searchedCollection], {
            total: 1,
            totalPages: 1,
          })
        );
      }

      if (search === "missing") {
        return Promise.resolve({
          success: false,
          error: "No collections found",
        });
      }

      return Promise.resolve(
        page === 2
          ? collectionPageResponse(2, [pageTwoCollection])
          : collectionPageResponse(1, [pageOneCollection])
      );
    }
  );
}

describe("ReadCollectionList pagination and search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clipboardWriteMock.mockResolvedValue(undefined);
    mockPaginatedCollectionReads();
  });

  it("fetches admin collection pages using route metadata controls", async () => {
    render(<ReadCollectionList />);

    expect(await screen.findByText("First Page Collection")).toBeInTheDocument();
    expect(screen.getByText("1 artworks")).toBeInTheDocument();
    expect(mockReadCollections).toHaveBeenLastCalledWith({
      page: 1,
      limit: 10,
    });
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous collection page" })
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Next collection page" })
    );

    expect(
      await screen.findByText("Second Page Collection")
    ).toBeInTheDocument();
    expect(screen.getByText("2 artworks")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadCollections).toHaveBeenLastCalledWith({
        page: 2,
        limit: 10,
      });
    });
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next collection page" })
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Previous collection page" })
    );

    expect(await screen.findByText("First Page Collection")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadCollections).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  it("sends search to the route and resets to the first page", async () => {
    render(<ReadCollectionList />);

    expect(await screen.findByText("First Page Collection")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Next collection page" })
    );

    expect(
      await screen.findByText("Second Page Collection")
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search collection title or slug",
      }),
      {
        target: {
          value: "archive",
        },
      }
    );

    expect(
      await screen.findByText("Archive Search Collection")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadCollections).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        search: "archive",
      });
    });
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(
      screen.queryByText("Second Page Collection")
    ).not.toBeInTheDocument();
  });

  it("shows a page no-results state", async () => {
    mockReadCollections.mockResolvedValueOnce({
      success: false,
      error: "No collections found",
    });

    render(<ReadCollectionList />);

    expect(
      await screen.findByText("No collections found on this page.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();
  });

  it("shows search no-results and error states", async () => {
    const { unmount } = render(<ReadCollectionList />);

    expect(await screen.findByText("First Page Collection")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search collection title or slug",
      }),
      {
        target: {
          value: "missing",
        },
      }
    );

    expect(
      await screen.findByText("No collections found for this search.")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadCollections).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
        search: "missing",
      });
    });
    expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();

    unmount();
    mockReadCollections.mockResolvedValueOnce({
      success: false,
      error: "Failed to fetch collections",
    });
    render(<ReadCollectionList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Failed to fetch collections"
    );
  });

  it("retains copy, update, and delete actions on searched collection cards", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadCollectionList />}
        updateComponent={<OperationProbe label="Update target" />}
        deleteComponent={<OperationProbe label="Delete target" />}
        disabledOperations={["create"]}
      />
    );

    expect(await screen.findByText("First Page Collection")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search collection title or slug",
      }),
      {
        target: {
          value: "archive",
        },
      }
    );

    expect(
      await screen.findByText("Archive Search Collection")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Copy Archive Search Collection ID",
      })
    );

    await waitFor(() => {
      expect(clipboardWriteMock).toHaveBeenCalledWith(searchedCollection._id);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Archive Search Collection" })
    );

    expect(
      await screen.findByText(`Update target: ${searchedCollection._id}`)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Read" }));
    expect(await screen.findByText("First Page Collection")).toBeInTheDocument();
    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search collection title or slug",
      }),
      {
        target: {
          value: "archive",
        },
      }
    );
    expect(
      await screen.findByText("Archive Search Collection")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Delete Archive Search Collection" })
    );

    expect(
      await screen.findByText(`Delete target: ${searchedCollection._id}`)
    ).toBeInTheDocument();
  });
});
