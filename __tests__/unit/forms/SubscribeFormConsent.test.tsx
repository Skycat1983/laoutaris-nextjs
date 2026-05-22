import { render, screen } from "@testing-library/react";
import { useFormState } from "react-dom";
import { usePathname } from "next/navigation";
import SubscribeForm from "@/components/modules/forms/user/SubscribeForm";

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormState: jest.fn(),
  useFormStatus: jest.fn(() => ({ pending: false })),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/lib/actions/submitSubscription", () => ({
  submitSubscription: jest.fn(),
}));

const mockUseFormState = useFormState as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

describe("SubscribeForm newsletter consent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFormState.mockReturnValue([{ success: false, message: "" }, "/"]);
    mockUsePathname.mockReturnValue("/artwork");
  });

  it("renders explicit newsletter consent copy with policy links", () => {
    render(<SubscribeForm />);

    expect(
      screen.getByText(/I agree to receive newsletter emails/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/understand I can unsubscribe at any time/)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy"
    );
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/terms"
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("submits the current public source path through a hidden form field", () => {
    const { container } = render(<SubscribeForm />);
    const sourcePath = container.querySelector('input[name="sourcePath"]');

    expect(sourcePath).toHaveAttribute("value", "/artwork");
  });
});
