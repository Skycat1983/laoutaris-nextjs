import { fireEvent, render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { CommentCard } from "@/components/modules/cards/CommentCard";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import type { CommentFrontendPopulated } from "@/lib/data/types";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/contexts/GlobalFeaturesContext", () => ({
  useGlobalFeatures: jest.fn(),
}));

const mockUseSession = useSession as jest.Mock;
const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;
const mockOpenModal = jest.fn();

const createComment = (
  authorId = "user-1"
): CommentFrontendPopulated =>
  ({
    _id: "comment-1",
    text: "A focused public comment.",
    displayDate: new Date("2024-05-01T12:00:00.000Z"),
    isOwner: true,
    author: {
      _id: authorId,
      username: "Joseph",
      isOwner: true,
    },
    blog: {
      _id: "blog-1",
      title: "Studio Notes",
      slug: "studio-notes",
      readTime: 3,
      commentCount: 1,
    },
  }) as CommentFrontendPopulated;

describe("CommentCard action accessibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalFeatures.mockReturnValue({ openModal: mockOpenModal });
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "user-1",
        },
      },
    });
  });

  it("renders owner edit and delete icon actions as labelled non-submit buttons", () => {
    render(<CommentCard comment={createComment()} />);

    const editButton = screen.getByRole("button", { name: "Edit comment" });
    const deleteButton = screen.getByRole("button", {
      name: "Delete comment",
    });

    expect(editButton).toHaveAttribute("type", "button");
    expect(deleteButton).toHaveAttribute("type", "button");
    expect(editButton.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(deleteButton.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("renders edit-mode cancel and save icon actions as labelled non-submit buttons", () => {
    render(<CommentCard comment={createComment()} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit comment" }));

    const cancelButton = screen.getByRole("button", {
      name: "Cancel editing comment",
    });
    const saveButton = screen.getByRole("button", {
      name: "Save updated comment",
    });

    expect(cancelButton).toHaveAttribute("type", "button");
    expect(saveButton).toHaveAttribute("type", "button");
    expect(cancelButton.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(saveButton.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("keeps comment action controls owner-only", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "other-user",
        },
      },
    });

    render(<CommentCard comment={createComment()} />);

    expect(
      screen.queryByRole("button", { name: "Edit comment" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete comment" })
    ).not.toBeInTheDocument();
  });
});
