import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignInForm from "@/components/modules/forms/user/SignInForm";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { signIn, useSession } from "next-auth/react";

jest.mock("@/components/modules/forms/user/SignUpForm", () => ({
  __esModule: true,
  default: function MockSignUpForm() {
    return null;
  },
}));

jest.mock("@/contexts/GlobalFeaturesContext", () => ({
  useGlobalFeatures: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;
const mockSignIn = signIn as jest.Mock;
const mockUseSession = useSession as jest.Mock;

const mockSetModalContent = jest.fn();
const mockUpdateSession = jest.fn();

const fillValidCredentials = () => {
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "member1" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password1" },
  });
};

describe("SignInForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalFeatures.mockReturnValue({
      setModalContent: mockSetModalContent,
    });
    mockUseSession.mockReturnValue({
      data: null,
      update: mockUpdateSession,
    });
    mockSignIn.mockResolvedValue({
      error: null,
      ok: true,
      status: 200,
      url: null,
    });
    mockUpdateSession.mockResolvedValue(null);
  });

  it("renders accessible credential fields", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText("Username")).toHaveAttribute(
      "name",
      "username"
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "name",
      "password"
    );
    expect(
      screen.getByRole("button", { name: "Sign in" })
    ).toBeInTheDocument();
  });

  it("shows validation errors without calling NextAuth", async () => {
    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("Username must be at least 5 characters.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 8 characters.")
    ).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("passes username and password to the credentials provider on success", async () => {
    render(<SignInForm />);
    fillValidCredentials();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        username: "member1",
        password: "password1",
        redirect: false,
      });
    });
    await waitFor(() => expect(mockUpdateSession).toHaveBeenCalledTimes(1));
    expect(mockSetModalContent).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          message: "Login successful.",
        }),
      })
    );
  });

  it("shows a generic auth error for bad credentials", async () => {
    mockSignIn.mockResolvedValueOnce({
      error: "CredentialsSignin",
      ok: false,
      status: 401,
      url: null,
    });

    render(<SignInForm />);
    fillValidCredentials();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid username or password."
    );
    expect(mockSetModalContent).not.toHaveBeenCalled();
  });

  it("switches to the sign-up modal from a keyboard-accessible button", () => {
    render(<SignInForm />);

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(mockSetModalContent).toHaveBeenCalledTimes(1);
    expect(mockSetModalContent.mock.calls[0][0].type.name).toBe(
      "MockSignUpForm"
    );
  });
});
