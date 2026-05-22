import { render, screen } from "@testing-library/react";
import { useFormState } from "react-dom";
import SignUpForm from "@/components/modules/forms/user/SignUpForm";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_REQUIRED_MESSAGE } from "@/lib/constants";

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormState: jest.fn(),
  useFormStatus: jest.fn(() => ({ pending: false })),
}));

jest.mock("@/contexts/GlobalFeaturesContext", () => ({
  useGlobalFeatures: jest.fn(),
}));

jest.mock("@/lib/actions/processRegistration", () => ({
  processRegistration: jest.fn(),
}));

jest.mock("@/components/modules/forms/user/SignInForm", () => ({
  __esModule: true,
  default: function MockSignInForm() {
    return null;
  },
}));

const mockUseFormState = useFormState as jest.Mock;
const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;

describe("SignUpForm privacy acknowledgement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalFeatures.mockReturnValue({ setModalContent: jest.fn() });
    mockUseFormState.mockReturnValue([
      { type: "validation", formValidationErrors: {} },
      "/",
    ]);
  });

  it("renders required account privacy and terms acknowledgement links", () => {
    render(<SignUpForm />);

    expect(
      screen.getByText(/I acknowledge the account/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
      "href",
      "/terms"
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("renders the acknowledgement validation error from the server action", () => {
    mockUseFormState.mockReturnValueOnce([
      {
        type: "validation",
        formValidationErrors: {
          accountPrivacyAcknowledged:
            ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_REQUIRED_MESSAGE,
        },
      },
      "/",
    ]);

    render(<SignUpForm />);

    expect(
      screen.getByText(ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_REQUIRED_MESSAGE)
    ).toBeInTheDocument();
  });
});
