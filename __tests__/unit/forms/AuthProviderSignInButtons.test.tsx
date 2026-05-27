import { fireEvent, render, screen } from "@testing-library/react";
import AuthProviderSignInButtons from "@/components/modules/forms/user/AuthProviderSignInButtons";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

const mockSignIn = signIn as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;

describe("AuthProviderSignInButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("callbackUrl=/account/comments")
    );
  });

  it("shows the OAuth privacy and terms notice before provider continuation", () => {
    render(<AuthProviderSignInButtons />);

    expect(screen.getByText(/By continuing with GitHub or Google/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
      "href",
      "/terms"
    );
    expect(
      screen.getByRole("button", { name: "Continue with GitHub" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with Google" })
    ).toBeInTheDocument();
  });

  it("continues to the selected provider with a sanitized callback path", () => {
    render(<AuthProviderSignInButtons />);

    fireEvent.click(screen.getByRole("button", { name: "Continue with GitHub" }));

    expect(mockSignIn).toHaveBeenCalledWith("github", {
      callbackUrl: "/account/comments",
    });
  });

  it("falls back to account settings for unsafe callback URLs", () => {
    mockUseSearchParams.mockReturnValueOnce(
      new URLSearchParams("callbackUrl=https://evil.example/account")
    );

    render(<AuthProviderSignInButtons />);
    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));

    expect(mockSignIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/account/settings",
    });
  });

  it("falls back to account settings when no callback URL is provided", () => {
    mockUseSearchParams.mockReturnValueOnce(new URLSearchParams());

    render(<AuthProviderSignInButtons />);
    fireEvent.click(screen.getByRole("button", { name: "Continue with GitHub" }));

    expect(mockSignIn).toHaveBeenCalledWith("github", {
      callbackUrl: "/account/settings",
    });
  });
});
