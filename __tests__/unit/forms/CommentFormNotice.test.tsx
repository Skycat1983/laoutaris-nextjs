import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CommentForm from "@/components/modules/forms/user/CommentForm";

describe("CommentForm posting notice", () => {
  it("shows public posting notice, policy links, and moderation handoff", () => {
    render(<CommentForm blogSlug="studio-notes" onCommentSubmit={jest.fn()} />);

    expect(
      screen.getByText(
        /Comments you submit, along with your display name or username, may be shown publicly on this blog post/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
      "href",
      "/terms"
    );
    expect(
      screen.getByRole("link", { name: "hlaoutaris@gmail.com" })
    ).toHaveAttribute("href", "mailto:hlaoutaris@gmail.com");
    expect(
      screen.getByText(/comment removal, correction, or moderation concerns/)
    ).toBeInTheDocument();
  });

  it("preserves the existing comment submit payload and reset behavior", async () => {
    const onCommentSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <CommentForm
        blogSlug="studio-notes"
        onCommentSubmit={onCommentSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Comment text"), {
      target: { value: "A focused public comment." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Post Comment" }));

    await waitFor(() => expect(onCommentSubmit).toHaveBeenCalledTimes(1));
    expect(onCommentSubmit).toHaveBeenCalledWith({
      text: "A focused public comment.",
      blogSlug: "studio-notes",
      displayDate: expect.any(Date),
    });
    expect(screen.getByLabelText("Comment text")).toHaveValue("");
  });
});
