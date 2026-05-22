import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import BiographyArticleNotFound from "@/app/biography/[slug]/not-found";
import BlogPostNotFound from "@/app/blog/[slug]/not-found";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("article and blog detail not-found contract", () => {
  it("uses shared public presentation for route-local not-found views", () => {
    const { rerender } = render(<BiographyArticleNotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Article not found"
    );
    expect(
      screen.getByRole("link", { name: "Browse biography" })
    ).toHaveAttribute("href", "/biography");

    rerender(<BlogPostNotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Blog post not found"
    );
    expect(screen.getByRole("link", { name: "Browse blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
  });
});
