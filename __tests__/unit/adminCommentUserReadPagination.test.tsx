import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReadCommentList } from "@/components/features/adminDashboard/crudForms/read/ReadCommentList";
import { ReadUserList } from "@/components/features/adminDashboard/crudForms/read/ReadUserList";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { clientApi } from "@/lib/api/clientApi";

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    admin: {
      read: {
        comments: jest.fn(),
        users: jest.fn(),
      },
    },
  },
}));

const mockReadComments = clientApi.admin.read.comments as jest.Mock;
const mockReadUsers = clientApi.admin.read.users as jest.Mock;
const clipboardWriteMock = jest.fn();

Object.defineProperty(global.navigator, "clipboard", {
  value: {
    writeText: clipboardWriteMock,
  },
  configurable: true,
});

const pageOneUser = {
  _id: "507f1f77bcf86cd799439601",
  username: "first-page-user",
  role: "user",
};

const pageTwoUser = {
  _id: "507f1f77bcf86cd799439602",
  username: "second-page-user",
  role: "admin",
};

const pageOneComment = {
  _id: "507f1f77bcf86cd799439701",
  text: "First page moderation note.",
  author: pageOneUser,
  blog: {
    _id: "507f1f77bcf86cd799439801",
    title: "First Page Blog",
  },
};

const pageTwoComment = {
  _id: "507f1f77bcf86cd799439702",
  text: "Second page moderation note.",
  author: pageTwoUser,
  blog: {
    _id: "507f1f77bcf86cd799439802",
    title: "Second Page Blog",
  },
};

const listPageResponse = <T,>(page: number, data: T[]) => ({
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

function mockPaginatedReads() {
  mockReadComments.mockImplementation(({ page }: { page?: number } = {}) =>
    Promise.resolve(
      page === 2
        ? listPageResponse(2, [pageTwoComment])
        : listPageResponse(1, [pageOneComment])
    )
  );
  mockReadUsers.mockImplementation(({ page }: { page?: number } = {}) =>
    Promise.resolve(
      page === 2
        ? listPageResponse(2, [pageTwoUser])
        : listPageResponse(1, [pageOneUser])
    )
  );
}

describe("ReadCommentList pagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clipboardWriteMock.mockResolvedValue(undefined);
    mockPaginatedReads();
  });

  it("fetches admin comment pages using route metadata controls", async () => {
    render(<ReadCommentList />);

    expect(
      await screen.findByText("First page moderation note.")
    ).toBeInTheDocument();
    expect(mockReadComments).toHaveBeenLastCalledWith({ page: 1, limit: 10 });
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous comment page" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Next comment page" }));

    expect(
      await screen.findByText("Second page moderation note.")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadComments).toHaveBeenLastCalledWith({
        page: 2,
        limit: 10,
      });
    });
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next comment page" })
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Previous comment page" })
    );

    expect(
      await screen.findByText("First page moderation note.")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadComments).toHaveBeenLastCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  it("shows comment empty and error states", async () => {
    mockReadComments.mockResolvedValueOnce({
      success: false,
      error: "No comments found",
    });
    const { unmount } = render(<ReadCommentList />);

    expect(
      await screen.findByText("No comments found on this page.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();

    unmount();
    mockReadComments.mockResolvedValueOnce({
      success: false,
      error: "Failed to fetch comments",
    });
    render(<ReadCommentList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Failed to fetch comments"
    );
  });

  it("retains copy and delete actions on paginated comment cards", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadCommentList />}
        deleteComponent={<OperationProbe label="Delete target" />}
        disabledOperations={["create", "update"]}
      />
    );

    expect(
      await screen.findByText("First page moderation note.")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next comment page" }));

    expect(
      await screen.findByText("Second page moderation note.")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Copy comment by second-page-user ID",
      })
    );

    await waitFor(() => {
      expect(clipboardWriteMock).toHaveBeenCalledWith(pageTwoComment._id);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Delete comment by second-page-user" })
    );

    expect(
      await screen.findByText(`Delete target: ${pageTwoComment._id}`)
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Delete" })).toHaveAttribute(
      "data-state",
      "active"
    );
  });
});

describe("ReadUserList pagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clipboardWriteMock.mockResolvedValue(undefined);
    mockPaginatedReads();
  });

  it("fetches admin user pages using route metadata controls", async () => {
    render(<ReadUserList />);

    expect(await screen.findByText("first-page-user")).toBeInTheDocument();
    expect(mockReadUsers).toHaveBeenLastCalledWith({ page: 1, limit: 10 });
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous user page" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Next user page" }));

    expect(await screen.findByText("second-page-user")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadUsers).toHaveBeenLastCalledWith({ page: 2, limit: 10 });
    });
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next user page" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Previous user page" }));

    expect(await screen.findByText("first-page-user")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockReadUsers).toHaveBeenLastCalledWith({ page: 1, limit: 10 });
    });
  });

  it("shows user empty and error states", async () => {
    mockReadUsers.mockResolvedValueOnce({
      success: false,
      error: "No users found",
    });
    const { unmount } = render(<ReadUserList />);

    expect(
      await screen.findByText("No users found on this page.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();

    unmount();
    mockReadUsers.mockResolvedValueOnce({
      success: false,
      error: "Failed to fetch users",
    });
    render(<ReadUserList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Failed to fetch users"
    );
  });

  it("retains copy and delete actions on paginated user cards", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadUserList />}
        deleteComponent={<OperationProbe label="Delete target" />}
        disabledOperations={["create", "update"]}
      />
    );

    expect(await screen.findByText("first-page-user")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next user page" }));

    expect(await screen.findByText("second-page-user")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Copy second-page-user ID" })
    );

    await waitFor(() => {
      expect(clipboardWriteMock).toHaveBeenCalledWith(pageTwoUser._id);
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Delete second-page-user" })
    );

    expect(
      await screen.findByText(`Delete target: ${pageTwoUser._id}`)
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Delete" })).toHaveAttribute(
      "data-state",
      "active"
    );
  });
});
