import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { DocumentReader } from "@/components/features/adminDashboard/DocumentReader";
import { ReadArticleList } from "@/components/features/adminDashboard/crudForms/read/ReadArticleList";
import { ArticleOperations } from "@/components/features/adminDashboard/operationTabs/ArticleOperations";
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
      },
      read: {
        article: jest.fn(),
        articles: jest.fn(),
        artwork: jest.fn(),
      },
    },
  },
}));

const mockReadArticles = clientApi.admin.read.articles as jest.Mock;
const mockReadArticle = clientApi.admin.read.article as jest.Mock;

const validContentImageUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/content.jpg";
const articleId = "507f1f77bcf86cd799439013";

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

describe("admin archive entry points", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReadArticles.mockResolvedValue({ success: true, data: [article] });
    mockReadArticle.mockResolvedValue({ success: true, data: article });
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
