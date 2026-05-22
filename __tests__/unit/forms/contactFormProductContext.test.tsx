import ContactPage from "@/app/project/contact/page";
import ContactForm from "@/components/modules/forms/user/ContactForm";
import { ArticleLoader } from "@/components/loaders/viewLoaders/ArticleLoader";
import { clientApi } from "@/lib/api/clientApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/components/loaders/viewLoaders/ArticleLoader", () => ({
  ArticleLoader: jest.fn(({ form }) => (
    <div data-testid="article-loader">{form}</div>
  )),
}));

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

const mockArticleLoader = ArticleLoader as jest.Mock;
const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;
const mockCreateEnquiry = clientApi.public.enquiry.create as jest.Mock;
const mockOpenModal = jest.fn();

const fillContactIdentity = () => {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Ada Buyer" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ada@example.com" },
  });
};

describe("Contact product enquiry context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalFeatures.mockReturnValue({
      openModal: mockOpenModal,
    });
    mockCreateEnquiry.mockResolvedValue({
      success: true,
      data: {
        success: true,
        message: "Enquiry received",
      },
    });
  });

  it("passes normalized product query context from the contact page into the form", async () => {
    render(
      await ContactPage({
        searchParams: { product: "  Limited-Print-01  " },
      })
    );

    expect(mockArticleLoader.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        slug: "contact",
        section: "project",
      })
    );
    expect(screen.getByLabelText("Subject")).toHaveValue(
      "Product enquiry: limited-print-01"
    );
    expect(screen.getByLabelText("Message")).toHaveValue(
      "I am interested in product limited-print-01. Please send purchase details."
    );
  });

  it("ignores invalid product query context before rendering the form", async () => {
    render(
      await ContactPage({
        searchParams: { product: "limited_print_01" },
      })
    );

    expect(screen.getByLabelText("Subject")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  it("submits the preserved product handle with user-entered contact fields", async () => {
    render(<ContactForm productHandle="limited-print-01" />);
    fillContactIdentity();

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
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });
});
