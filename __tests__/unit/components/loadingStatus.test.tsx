import { render, screen } from "@testing-library/react";
import { useFormStatus } from "react-dom";
import PageLoading from "@/components/animations/PageLoading";
import { SubmitButton } from "@/components/elements/buttons/SubmitButton";
import { LoadingStatus } from "@/components/elements/misc/LoadingStatus";
import { Spinner } from "@/components/elements/misc/Spinner";

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormStatus: jest.fn(),
}));

const mockUseFormStatus = useFormStatus as jest.Mock;

describe("shared loading status components", () => {
  beforeEach(() => {
    mockUseFormStatus.mockReturnValue({ pending: false });
  });

  it("announces a non-visible loading label without adding visible text", () => {
    render(<LoadingStatus label="Loading more artworks" />);

    expect(
      screen.getByRole("status", { name: "Loading more artworks" })
    ).toBeInTheDocument();
    expect(screen.getByText("Loading more artworks")).toHaveClass("sr-only");
  });

  it("keeps Spinner compatible while exposing status semantics", () => {
    render(<Spinner label="Loading artwork details" />);

    expect(
      screen.getByRole("status", { name: "Loading artwork details" })
    ).toBeInTheDocument();
  });

  it("uses a page-specific loading announcement for the global fallback", () => {
    render(<PageLoading />);

    expect(
      screen.getByRole("status", { name: "Loading page" })
    ).toHaveTextContent("Loading page");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("uses an actionable pending label in submit buttons", () => {
    mockUseFormStatus.mockReturnValue({ pending: true });

    render(<SubmitButton label="Save artwork" />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(
      screen.getByRole("status", { name: "Submitting..." })
    ).toHaveTextContent("Submitting...");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
