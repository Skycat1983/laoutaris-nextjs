import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactForm from "@/components/modules/forms/user/ContactForm";
import EnquiryForm from "@/components/modules/forms/user/EnquiryForm";
import { clientApi } from "@/lib/api/clientApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";

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
  },
}));

const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;
const mockCreateEnquiry = clientApi.public.enquiry.create as jest.Mock;
const mockOpenModal = jest.fn();

const expectContactEnquiryNotice = () => {
  expect(
    screen.getByText(
      /your name, email, subject, message, and any product or artwork context are used to respond to you/
    )
  ).toBeInTheDocument();
  expect(screen.getByText(/manage the manual enquiry record/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
    "href",
    "/privacy"
  );
  expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
    "href",
    "/terms"
  );
  expect(
    screen.getByRole("link", { name: "hlaoutaris@gmail.com" })
  ).toHaveAttribute("href", "mailto:hlaoutaris@gmail.com");
  expect(
    screen.getByText(/privacy or legal questions, correction, or deletion requests/)
  ).toBeInTheDocument();
};

describe("contact and artwork enquiry privacy notice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalFeatures.mockReturnValue({ openModal: mockOpenModal });
    mockCreateEnquiry.mockResolvedValue({
      success: true,
      data: {
        success: true,
        message: "Enquiry received",
      },
    });
  });

  it("shows the approved notice, policy links, and manual handoff on the contact form", () => {
    render(<ContactForm productHandle="limited-print-01" />);

    expectContactEnquiryNotice();
  });

  it("shows the same notice on the artwork enquiry form", () => {
    render(<EnquiryForm artworkId="artwork-123" />);

    expectContactEnquiryNotice();
  });

  it("preserves the contact product enquiry submit payload", async () => {
    render(<ContactForm productHandle="limited-print-01" />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada Buyer" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(mockCreateEnquiry).toHaveBeenCalledWith({
        name: "Ada Buyer",
        email: "ada@example.com",
        subject: "Product enquiry: limited-print-01",
        message:
          "I am interested in product limited-print-01. Please send purchase details.",
        productHandle: "limited-print-01",
      });
    });
  });

  it("preserves the artwork enquiry submit payload", async () => {
    render(<EnquiryForm artworkId="artwork-123" />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada Visitor" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "visitor@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Please send details about this artwork." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockCreateEnquiry).toHaveBeenCalledWith({
        name: "Ada Visitor",
        email: "visitor@example.com",
        subject: "artwork-123",
        message: "Please send details about this artwork.",
      });
    });
  });
});
