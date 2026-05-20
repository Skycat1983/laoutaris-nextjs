import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { DocumentReader } from "@/components/features/adminDashboard/DocumentReader";
import { ReadArticleList } from "@/components/features/adminDashboard/crudForms/read/ReadArticleList";
import { ReadCommentList } from "@/components/features/adminDashboard/crudForms/read/ReadCommentList";
import { ReadUserList } from "@/components/features/adminDashboard/crudForms/read/ReadUserList";
import { ArticleOperations } from "@/components/features/adminDashboard/operationTabs/ArticleOperations";
import { CommentOperations } from "@/components/features/adminDashboard/operationTabs/CommentOperations";
import { UserOperations } from "@/components/features/adminDashboard/operationTabs/UserOperations";
import { clientApi } from "@/lib/api/clientApi";
import type { AdminDeletePreview } from "@/lib/api/admin/delete/previewTypes";

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

jest.mock("@/contexts/GlobalFeaturesContext", () => ({
  useGlobalFeatures: () => ({
    openModal: jest.fn(),
  }),
}));

jest.mock(
  "@/components/features/adminDashboard/crudForms/update/UpdateArticleForm",
  () => ({
    UpdateArticleForm: ({ articleInfo }: { articleInfo: { title: string } }) => (
      <div>Loaded article update form: {articleInfo.title}</div>
    ),
  })
);

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    admin: {
      create: {
        article: jest.fn(),
      },
      delete: {
        article: jest.fn(),
        comment: jest.fn(),
        user: jest.fn(),
        preview: {
          comment: jest.fn(),
          user: jest.fn(),
        },
      },
      read: {
        article: jest.fn(),
        articles: jest.fn(),
        artwork: jest.fn(),
        comment: jest.fn(),
        comments: jest.fn(),
        user: jest.fn(),
        users: jest.fn(),
      },
    },
  },
}));

const mockReadArticles = clientApi.admin.read.articles as jest.Mock;
const mockReadArticle = clientApi.admin.read.article as jest.Mock;
const mockReadComments = clientApi.admin.read.comments as jest.Mock;
const mockReadComment = clientApi.admin.read.comment as jest.Mock;
const mockReadUsers = clientApi.admin.read.users as jest.Mock;
const mockReadUser = clientApi.admin.read.user as jest.Mock;
const mockPreviewCommentDelete = clientApi.admin.delete.preview.comment as jest.Mock;
const mockPreviewUserDelete = clientApi.admin.delete.preview.user as jest.Mock;
const mockDeleteComment = clientApi.admin.delete.comment as jest.Mock;
const mockDeleteUser = clientApi.admin.delete.user as jest.Mock;

const validContentImageUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/content.jpg";
const articleId = "507f1f77bcf86cd799439013";
const commentId = "507f1f77bcf86cd799439014";
const userId = "507f1f77bcf86cd799439015";

const article = {
  _id: articleId,
  title: "Archive Article",
  subtitle: "Article subtitle",
  summary: "A valid article summary.",
  text: "A valid article body with enough content for the form schema to pass.",
  imageUrl: validContentImageUrl,
  section: "artwork",
  overlayColour: "white",
  artwork: {
    _id: "507f1f77bcf86cd799439012",
    title: "Archive Work",
    image: {
      secure_url: validContentImageUrl,
    },
  },
};

const user = {
  _id: userId,
  username: "archive-admin",
  role: "admin",
};

const comment = {
  _id: commentId,
  text: "A moderation note for the archive.",
  author: user,
  blog: {
    _id: "507f1f77bcf86cd799439016",
    title: "Archive Blog",
  },
};

const deletePreviewFor = (
  resource: "comment" | "user",
  id: string,
  label: string
): AdminDeletePreview => ({
  resource,
  target: {
    resource,
    id,
    label,
  },
  blocked: false,
  blockingConditions: [],
  wouldDelete: [
    {
      action: "delete",
      resource,
      count: 1,
      records: [
        {
          resource,
          id,
          label,
        },
      ],
      description: `Delete the target ${resource} record.`,
    },
  ],
  wouldDetachOrUpdate: [],
  preserved: [],
  productionEvidenceReminders: [
    {
      code: "mongodb_backup",
      label: "MongoDB backup/export evidence",
      required: true,
      description:
        "Confirm a current MongoDB backup or export exists before running destructive production deletes.",
    },
    {
      code: "owner_review",
      label: "Owner or delegated review evidence",
      required: true,
      description:
        "Confirm owner-approved or delegated review evidence before running destructive production deletes.",
    },
  ],
});

describe("admin archive entry points", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReadArticles.mockResolvedValue({ success: true, data: [article] });
    mockReadArticle.mockResolvedValue({ success: true, data: article });
    mockReadComments.mockResolvedValue({ success: true, data: [comment] });
    mockReadComment.mockResolvedValue({ success: true, data: comment });
    mockReadUsers.mockResolvedValue({ success: true, data: [user] });
    mockReadUser.mockResolvedValue({ success: true, data: user });
    mockPreviewCommentDelete.mockResolvedValue({
      success: true,
      data: deletePreviewFor("comment", commentId, comment.text),
    });
    mockPreviewUserDelete.mockResolvedValue({
      success: true,
      data: deletePreviewFor("user", userId, user.username),
    });
    mockDeleteComment.mockResolvedValue({ success: true, data: null });
    mockDeleteUser.mockResolvedValue({ success: true, data: null });
  });

  it("selects an article from the read list and opens the loaded update workflow", async () => {
    render(
      <AdminCrudTabs
        createComponent={<div>Create article</div>}
        readComponent={<ReadArticleList />}
        updateComponent={<ArticleOperations operationType="update" />}
        deleteComponent={<ArticleOperations operationType="delete" />}
      />
    );

    fireEvent.click(screen.getByRole("tab", { name: "Read" }));

    expect(await screen.findByText("Archive Article")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Update Archive Article" })
    );

    await waitFor(() => {
      expect(mockReadArticle).toHaveBeenCalledWith(articleId);
    });
    expect(
      await screen.findByText("Loaded article update form: Archive Article")
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Update" })).toHaveAttribute(
      "data-state",
      "active"
    );
  });

  it("selects a comment from the read list and opens the delete confirmation without deleting", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadCommentList />}
        deleteComponent={<CommentOperations operationType="delete" />}
        disabledOperations={["create", "update"]}
      />
    );

    expect(await screen.findByText("A moderation note for the archive."))
      .toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Delete comment by archive-admin" })
    );

    await waitFor(() => {
      expect(mockReadComment).toHaveBeenCalledWith(commentId);
    });
    expect(await screen.findByText("Delete Comment")).toBeInTheDocument();
    expect(mockPreviewCommentDelete).toHaveBeenCalledWith(commentId);
    expect(await screen.findByText("Required delete evidence"))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm Delete" }))
      .toBeDisabled();
    expect(mockDeleteComment).not.toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "Delete" })).toHaveAttribute(
      "data-state",
      "active"
    );
  });

  it("selects a user from the read list and opens the delete confirmation without deleting", async () => {
    render(
      <AdminCrudTabs
        readComponent={<ReadUserList />}
        deleteComponent={<UserOperations operationType="delete" />}
        disabledOperations={["create", "update"]}
      />
    );

    expect(await screen.findByText("archive-admin")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete archive-admin" }));

    await waitFor(() => {
      expect(mockReadUser).toHaveBeenCalledWith(userId);
    });
    expect(await screen.findByText("Delete User")).toBeInTheDocument();
    expect(mockPreviewUserDelete).toHaveBeenCalledWith(userId);
    expect(await screen.findByText("Required delete evidence"))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm Delete" }))
      .toBeDisabled();
    expect(mockDeleteUser).not.toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "Delete" })).toHaveAttribute(
      "data-state",
      "active"
    );
  });

  it("keeps manual document lookup available and reports lookup failures", async () => {
    const readDocument = jest
      .fn()
      .mockResolvedValueOnce({ success: false, error: "Not found" })
      .mockResolvedValueOnce({ success: true, data: article });
    const onDocumentFound = jest.fn();

    render(
      <DocumentReader
        onDocumentFound={onDocumentFound}
        readDocument={readDocument}
        documentType="Article"
      />
    );

    fireEvent.change(screen.getByLabelText("Article ID"), {
      target: { value: "missing-article" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Find Article" }));

    expect(await screen.findByText("Article not found")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Article ID"), {
      target: { value: articleId },
    });
    fireEvent.click(screen.getByRole("button", { name: "Find Article" }));

    await waitFor(() => {
      expect(onDocumentFound).toHaveBeenCalledWith(article);
    });
    expect(readDocument).toHaveBeenLastCalledWith(articleId);
  });
});
