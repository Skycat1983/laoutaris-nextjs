import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactForm from "@/components/modules/forms/user/ContactForm";
import CommentForm from "@/components/modules/forms/user/CommentForm";
import LogoutForm from "@/components/modules/forms/user/LogoutForm";
import { CommentCard } from "@/components/modules/cards/CommentCard";
import { ErrorBoundary } from "@/components/modules/error/ErrorBoundary";
import { AccountNavDropdown } from "@/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown";
import { clientApi } from "@/lib/api/clientApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import type { CommentFrontendPopulated } from "@/lib/data/types";

jest.mock("@/components/shadcn/navigation-menu", () => {
  const React = require("react");

  return {
    NavigationMenu: ({ children }: { children: React.ReactNode }) => (
      <nav>{children}</nav>
    ),
    NavigationMenuContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    NavigationMenuItem: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    NavigationMenuLink: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    NavigationMenuList: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    NavigationMenuTrigger: ({ children }: { children: React.ReactNode }) => (
      <button type="button">{children}</button>
    ),
  };
});

jest.mock("@/contexts/GlobalFeaturesContext", () => ({
  useGlobalFeatures: jest.fn(),
}));

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    public: {
      enquiry: {
        create: jest.fn(),
      },
    },
    user: {
      comments: {
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
      },
    },
  },
}));

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;
const mockCreateEnquiry = clientApi.public.enquiry.create as jest.Mock;
const mockUpdateComment = clientApi.user.comments.updateComment as jest.Mock;
const mockDeleteComment = clientApi.user.comments.deleteComment as jest.Mock;
const mockSignOut = signOut as jest.Mock;
const mockUseSession = useSession as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockOpenModal = jest.fn();
const mockPush = jest.fn();

const createComment = (): CommentFrontendPopulated =>
  ({
    _id: "comment-1",
    text: "A focused public comment.",
    displayDate: new Date("2026-05-18T12:00:00.000Z"),
    isOwner: true,
    author: {
      _id: "user-1",
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

const fillContactForm = () => {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Ada Buyer" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ada@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Subject"), {
    target: { value: "Studio visit" },
  });
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "Please send details about visiting the archive." },
  });
};

describe("account and user client error states", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalFeatures.mockReturnValue({ openModal: mockOpenModal });
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUsePathname.mockReturnValue("/account/settings");
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "user-1",
        },
      },
    });
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("keeps contact API failure modal behavior and resets the form after an API response", async () => {
    mockCreateEnquiry.mockResolvedValue({ success: false });

    render(<ContactForm />);
    fillContactForm();

    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => expect(mockOpenModal).toHaveBeenCalledTimes(1));
    expect(mockOpenModal.mock.calls[0][0].props).toEqual({
      message: "Enquiry submission failed",
      type: "error",
    });
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Subject")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  it("keeps comment form draft text available when submit rejects", async () => {
    const onCommentSubmit = jest
      .fn()
      .mockRejectedValue(new Error("private comment failure"));

    render(<CommentForm blogSlug="studio-notes" onCommentSubmit={onCommentSubmit} />);

    fireEvent.change(screen.getByLabelText("Comment text"), {
      target: { value: "A retryable comment draft." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Post Comment" }));

    await waitFor(() => expect(onCommentSubmit).toHaveBeenCalledTimes(1));
    expect(screen.getByLabelText("Comment text")).toHaveValue(
      "A retryable comment draft."
    );
  });

  it("keeps logout failure modal behavior and resets loading state", async () => {
    mockSignOut.mockRejectedValue(new Error("private auth failure"));

    render(<LogoutForm />);

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => expect(mockOpenModal).toHaveBeenCalledTimes(1));
    expect(mockOpenModal.mock.calls[0][0].props).toEqual({
      message: "Logout failed.",
    });
    expect(screen.getByRole("button", { name: "Logout" })).toBeEnabled();
  });

  it("replaces account deletion with a manual privacy request handoff", () => {
    render(<LogoutForm />);

    expect(
      screen.queryByRole("button", { name: "Delete Account" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Email privacy request" })
    ).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:hlaoutaris@gmail.com")
    );
    expect(
      screen.getByText(/account deletion, data export, or account correction/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not perform self-service deletion or export/)
    ).toBeInTheDocument();
  });

  it("keeps account dropdown logout failure modal behavior", async () => {
    mockSignOut.mockRejectedValue(new Error("private auth failure"));

    render(<AccountNavDropdown />);

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => expect(mockOpenModal).toHaveBeenCalledTimes(1));
    expect(mockOpenModal.mock.calls[0][0].props).toEqual({
      message: "Logout failed.",
    });
  });

  it("uses App Router links for unauthenticated sign-in actions and disables account actions", () => {
    mockUseSession.mockReturnValue({ data: null });

    render(<AccountNavDropdown />);

    expect(screen.getByRole("button", { name: "Profile" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Logout" })).toBeDisabled();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in"
    );
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/sign-in?mode=signup"
    );
  });

  it("uses an App Router profile link for authenticated users and disables auth entry links", () => {
    render(<AccountNavDropdown />);

    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/account/settings"
    );
    expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Logout" })).toBeEnabled();
  });

  it("keeps comment-card edit failure in edit mode for retry", async () => {
    mockUpdateComment.mockRejectedValue(new Error("private update failure"));

    render(<CommentCard comment={createComment()} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit comment" }));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Updated retryable comment." },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Save updated comment" })
    );

    await waitFor(() => expect(mockUpdateComment).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("textbox")).toHaveValue(
      "Updated retryable comment."
    );
    expect(
      screen.getByRole("button", { name: "Save updated comment" })
    ).toBeEnabled();
  });

  it("keeps comment-card delete failure modal behavior and resets loading state", async () => {
    mockDeleteComment.mockRejectedValue(new Error("private delete failure"));

    render(<CommentCard comment={createComment()} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete comment" }));

    await waitFor(() => expect(mockOpenModal).toHaveBeenCalledTimes(1));
    expect(mockOpenModal.mock.calls[0][0].props).toEqual({
      message: "Failed to delete comment",
      type: "error",
    });
    expect(
      screen.getByRole("button", { name: "Delete comment" })
    ).toBeEnabled();
  });

  it("keeps error-boundary fallback behavior for window error events", async () => {
    render(
      <ErrorBoundary fallback={<div>Fallback rendered</div>}>
        <div>Child content</div>
      </ErrorBoundary>
    );

    fireEvent(window, new ErrorEvent("error"));

    await waitFor(() =>
      expect(screen.getByText("Fallback rendered")).toBeInTheDocument()
    );
    expect(screen.queryByText("Child content")).not.toBeInTheDocument();
  });
});
