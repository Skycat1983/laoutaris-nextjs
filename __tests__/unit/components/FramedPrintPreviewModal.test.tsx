/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "fs";
import path from "path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FramedPrintPreviewModal } from "@/components/shop/frame-preview/FramedPrintPreviewModal";
import { FRAME_PROFILES } from "@/lib/framePreview/frameProfiles";
import { MAT_PROFILES } from "@/lib/framePreview/matProfiles";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) => (
    <img src={String(src)} alt={String(alt)} {...props} />
  ),
}));

const artwork = {
  src: "/modal-artwork.jpg",
  alt: "Modal artwork",
  metrics: {
    pixelWidth: 1200,
    pixelHeight: 900,
  },
};

const renderModal = (overrides = {}) => {
  const onClose = jest.fn();

  render(
    <FramedPrintPreviewModal
      isOpen
      onClose={onClose}
      artwork={artwork}
      frameProfiles={FRAME_PROFILES}
      matProfile={MAT_PROFILES[1]}
      bounds={{ maxWidthPx: 620, maxHeightPx: 460 }}
      {...overrides}
    />
  );

  return { onClose };
};

describe("FramedPrintPreviewModal", () => {
  it("renders an accessible modal around the framed artwork preview", async () => {
    renderModal({ initialFrameProfileId: "natural-oak-medium" });

    expect(
      screen.getByRole("dialog", { name: "Frame Preview" })
    ).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("img", { name: "Modal artwork" })).toHaveAttribute(
      "src",
      "/modal-artwork.jpg"
    );
    expect(
      screen.getByRole("figure", { name: "Framed preview of Modal artwork" })
    ).toHaveAttribute("data-frame-profile-id", "natural-oak-medium");
    expect(
      screen.getByRole("figure", { name: "Framed preview of Modal artwork" })
    ).toHaveStyle({
      maxWidth: "100%",
    });
    expect(screen.getByTestId("framed-preview-outer")).toHaveStyle({
      width: "100%",
      maxWidth: "100%",
    });
    expect(
      screen.getByRole("button", { name: "Preview Natural Oak frame" })
    ).toHaveAttribute("aria-pressed", "true");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Close frame preview" })
      ).toHaveFocus();
    });
  });

  it("returns null when closed or when no frame profiles are available", () => {
    const { container: closedContainer } = render(
      <FramedPrintPreviewModal
        isOpen={false}
        onClose={jest.fn()}
        artwork={artwork}
      />
    );
    const { container: emptyProfileContainer } = render(
      <FramedPrintPreviewModal
        isOpen
        onClose={jest.fn()}
        artwork={artwork}
        frameProfiles={[]}
      />
    );

    expect(closedContainer).toBeEmptyDOMElement();
    expect(emptyProfileContainer).toBeEmptyDOMElement();
  });

  it("closes from the close button, Escape key, and backdrop", () => {
    const { onClose } = renderModal();

    fireEvent.click(screen.getByRole("button", { name: "Close frame preview" }));
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.mouseDown(screen.getByRole("presentation"));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("cycles frame materials with previous and next controls", () => {
    renderModal({ initialFrameProfileId: "black-wood-thin" });

    const figure = screen.getByRole("figure", {
      name: "Framed preview of Modal artwork",
    });

    expect(figure).toHaveAttribute("data-frame-profile-id", "black-wood-thin");

    fireEvent.click(screen.getByRole("button", { name: "Next frame material" }));

    expect(figure).toHaveAttribute("data-frame-profile-id", "white-wood-thin");

    fireEvent.click(
      screen.getByRole("button", { name: "Previous frame material" })
    );

    expect(figure).toHaveAttribute("data-frame-profile-id", "black-wood-thin");

    fireEvent.click(
      screen.getByRole("button", { name: "Previous frame material" })
    );

    expect(figure).toHaveAttribute("data-frame-profile-id", "brushed-metal-narrow");
  });

  it("selects a frame material directly from swatches", () => {
    renderModal({ initialFrameProfileId: "black-wood-thin" });

    fireEvent.click(screen.getByRole("button", { name: "Preview Walnut frame" }));

    expect(
      screen.getByRole("figure", { name: "Framed preview of Modal artwork" })
    ).toHaveAttribute("data-frame-profile-id", "walnut-medium");
    expect(
      screen.getByRole("button", { name: "Preview Walnut frame" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("falls back to the first frame profile when the initial profile is unknown", () => {
    renderModal({ initialFrameProfileId: "missing-frame" });

    expect(
      screen.getByRole("figure", { name: "Framed preview of Modal artwork" })
    ).toHaveAttribute("data-frame-profile-id", "black-wood-thin");
  });

  it("does not include product-page or commerce behavior", () => {
    renderModal();

    expect(screen.queryByText(/checkout|cart|enquire|buy framed/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("keeps modal source isolated from product, Shopify, and prototype route wiring", () => {
    const modalSource = readFileSync(
      path.join(
        process.cwd(),
        "src/components/shop/frame-preview/FramedPrintPreviewModal.tsx"
      ),
      "utf8"
    );
    const controlsSource = readFileSync(
      path.join(
        process.cwd(),
        "src/components/shop/frame-preview/FrameMaterialControls.tsx"
      ),
      "utf8"
    );
    const source = `${modalSource}\n${controlsSource}`;

    expect(source).not.toMatch(/@\/lib\/api\/shopify|@\/lib\/data\/services/);
    expect(source).not.toMatch(/@\/lib\/data\/models|@\/lib\/db/);
    expect(source).not.toMatch(/project\/contact|checkout|cart/i);
    expect(source).not.toMatch(/prototype\/frame|productHandle/);
  });
});
