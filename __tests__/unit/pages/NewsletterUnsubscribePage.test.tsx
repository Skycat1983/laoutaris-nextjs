import { render, screen } from "@testing-library/react";
import NewsletterUnsubscribePage, {
  metadata,
} from "@/app/newsletter/unsubscribe/page";

jest.mock("@/components/modules/forms/user/UnsubscribeForm", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="unsubscribe-form" />),
}));

describe("newsletter unsubscribe page", () => {
  it("renders the public unsubscribe process for a valid identifier", () => {
    render(
      <NewsletterUnsubscribePage
        searchParams={{
          token: "safe-token-placeholder-123456789012345",
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Newsletter Unsubscribe" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("unsubscribe-form")).toBeInTheDocument();
    expect(
      screen.queryByText("This unsubscribe link is invalid or has expired.")
    ).not.toBeInTheDocument();
  });

  it("shows public-safe output for missing or invalid identifiers", () => {
    render(
      <NewsletterUnsubscribePage
        searchParams={{
          token: "invalid",
        }}
      />
    );

    expect(screen.queryByTestId("unsubscribe-form")).not.toBeInTheDocument();
    expect(
      screen.getByText("This unsubscribe link is invalid or has expired.")
    ).toBeInTheDocument();
  });

  it("declares route metadata", () => {
    expect(metadata).toEqual(
      expect.objectContaining({
        title: "Newsletter Unsubscribe",
        alternates: { canonical: "/newsletter/unsubscribe" },
      })
    );
  });
});
