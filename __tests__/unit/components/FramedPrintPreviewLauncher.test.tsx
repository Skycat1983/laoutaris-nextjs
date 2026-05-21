/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";
import { FramedPrintPreviewLauncher } from "@/components/shop/frame-preview/FramedPrintPreviewLauncher";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) => (
    <img src={String(src)} alt={String(alt)} {...props} />
  ),
}));

const artwork = {
  src: "https://example.com/print-preview.jpg",
  alt: "Linked print artwork",
  metrics: {
    pixelWidth: 1400,
    pixelHeight: 1000,
  },
};

describe("FramedPrintPreviewLauncher", () => {
  it("opens and closes the framed preview modal from a product-page button", () => {
    render(<FramedPrintPreviewLauncher artwork={artwork} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Preview Frame Options" })
    );

    expect(
      screen.getByRole("dialog", { name: "Frame Preview" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Linked print artwork" })
    ).toHaveAttribute("src", "https://example.com/print-preview.jpg");
    expect(
      screen.getByRole("figure", {
        name: "Framed preview of Linked print artwork",
      })
    ).toHaveAttribute("data-mat-profile-id", "warm-white");

    fireEvent.click(screen.getByRole("button", { name: "Close frame preview" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps product page frame selection preview-only", () => {
    render(<FramedPrintPreviewLauncher artwork={artwork} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/checkout|cart|enquire|buy framed/i)
    ).not.toBeInTheDocument();
  });

  it("keeps launcher source isolated from Shopify, data services, and product enquiries", () => {
    const source = readFileSync(
      path.join(
        process.cwd(),
        "src/components/shop/frame-preview/FramedPrintPreviewLauncher.tsx"
      ),
      "utf8"
    );

    expect(source).not.toMatch(/@\/lib\/api\/shopify|@\/lib\/data\/services/);
    expect(source).not.toMatch(/@\/lib\/data\/models|@\/lib\/db/);
    expect(source).not.toMatch(/project\/contact|checkout|cart/i);
    expect(source).not.toMatch(/productHandle|mongodbArtworkId/);
  });
});
