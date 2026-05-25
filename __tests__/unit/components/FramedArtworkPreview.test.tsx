/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";
import { FramedArtworkPreview } from "@/components/shop/frame-preview/FramedArtworkPreview";
import { RoomFramedArtworkPreview } from "@/components/shop/frame-preview/RoomFramedArtworkPreview";
import { FRAME_PROFILES } from "@/lib/framePreview/frameProfiles";
import { MAT_PROFILES } from "@/lib/framePreview/matProfiles";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (
    jest.requireActual("react") as typeof import("react")
  ).forwardRef<HTMLImageElement, Record<string, unknown>>(function MockImage(
    {
      src,
      alt,
      fill: _fill,
      priority: _priority,
      unoptimized: _unoptimized,
      ...props
    },
    ref
  ) {
    return <img ref={ref} src={String(src)} alt={String(alt)} {...props} />;
  }),
}));

const artwork = {
  src: "/test-artwork.jpg",
  alt: "Test artwork",
  metrics: {
    pixelWidth: 1200,
    pixelHeight: 900,
  },
};

describe("FramedArtworkPreview", () => {
  it("renders a framed artwork preview from geometry output", () => {
    render(
      <FramedArtworkPreview
        artwork={artwork}
        frameProfile={FRAME_PROFILES[2]}
        matProfile={MAT_PROFILES[1]}
        bounds={{ maxWidthPx: 640, maxHeightPx: 480 }}
      />
    );

    expect(
      screen.getByRole("figure", { name: "Framed preview of Test artwork" })
    ).toHaveAttribute("data-frame-profile-id", "natural-oak-medium");
    expect(
      screen.getByRole("figure", { name: "Framed preview of Test artwork" })
    ).toHaveAttribute("data-mat-profile-id", "warm-white");
    expect(screen.getByRole("img", { name: "Test artwork" })).toHaveAttribute(
      "src",
      "/test-artwork.jpg"
    );
    expect(screen.getByTestId("framed-preview-outer")).toHaveStyle({
      maxWidth: "100%",
    });
    expect(screen.getByTestId("framed-preview-frame")).toHaveStyle({
      background:
        "linear-gradient(135deg, #c99b5b 0%, #d8b579 42%, #9f743f 51%, #d8b579 60%, #c99b5b 100%)",
    });
    expect(screen.getByTestId("framed-preview-mat")).toHaveStyle({
      backgroundColor: "#f7f2e8",
    });
    expect(screen.getByText(/Natural Oak frame preview/)).toHaveClass(
      "sr-only"
    );
  });

  it("uses stable default profiles when none are supplied", () => {
    render(
      <FramedArtworkPreview
        artwork={artwork}
        bounds={{ maxWidthPx: 500, maxHeightPx: 500 }}
      />
    );

    const figure = screen.getByRole("figure", {
      name: "Framed preview of Test artwork",
    });

    expect(figure).toHaveAttribute("data-frame-profile-id", "black-wood-thin");
    expect(figure).toHaveAttribute("data-mat-profile-id", "none");
    expect(figure).toHaveAttribute("data-render-mode", "simple");
    expect(figure).toHaveAttribute("data-sizing-mode", "fitOuter");
    expect(figure).toHaveAttribute("data-scale-mode", "relativePreview");
    expect(screen.getByTestId("framed-preview-mat")).toHaveStyle({
      backgroundColor: "transparent",
    });
  });

  it("can render rail-based material panels, bevel, and mitred corner layers", () => {
    render(
      <FramedArtworkPreview
        artwork={artwork}
        frameProfile={FRAME_PROFILES[3]}
        matProfile={MAT_PROFILES[1]}
        bounds={{ maxWidthPx: 640, maxHeightPx: 480 }}
        renderMode="rails"
      />
    );

    expect(
      screen.getByRole("figure", { name: "Framed preview of Test artwork" })
    ).toHaveAttribute("data-render-mode", "rails");
    expect(screen.getByTestId("framed-preview-frame")).toHaveAttribute(
      "data-frame-renderer",
      "rails"
    );
    expect(
      screen.getByTestId("framed-preview-rail-top").getAttribute("style")
    ).toContain("clip-path: polygon");
    expect(screen.getByTestId("framed-preview-rail-top")).toHaveAttribute(
      "data-frame-texture-kind",
      "wood-grain"
    );
    expect(screen.getByTestId("framed-preview-rail-top")).toHaveAttribute(
      "data-frame-texture-mode",
      "panel"
    );
    expect(screen.getByTestId("framed-preview-rail-top")).toHaveStyle({
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 100%",
    });
    expect(
      screen.getByTestId("framed-preview-rail-top").getAttribute("style")
    ).not.toContain("repeating-linear-gradient");
    expect(screen.getAllByTestId("framed-preview-miter-seam")).toHaveLength(4);
    expect(screen.getByTestId("framed-preview-inner-bevel")).toBeInTheDocument();
    expect(screen.getByTestId("framed-preview-glass-sheen")).toBeInTheDocument();
  });

  it("surfaces physical scale mode when complete print dimensions are available", () => {
    render(
      <FramedArtworkPreview
        artwork={{
          ...artwork,
          metrics: {
            pixelWidth: 1000,
            pixelHeight: 1000,
            physicalPrintWidthCm: 40,
            physicalPrintHeightCm: 40,
          },
        }}
        frameProfile={FRAME_PROFILES[3]}
        matProfile={MAT_PROFILES[1]}
        bounds={{ maxWidthPx: 600, maxHeightPx: 600 }}
      />
    );

    expect(
      screen.getByRole("figure", { name: "Framed preview of Test artwork" })
    ).toHaveAttribute("data-scale-mode", "physicalScalePreview");
  });

  it("does not own modal, carousel, product, or commerce behavior", () => {
    render(
      <FramedArtworkPreview
        artwork={artwork}
        bounds={{ maxWidthPx: 500, maxHeightPx: 500 }}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/checkout|enquire|choose frame/i)
    ).not.toBeInTheDocument();
  });

  it("keeps the standalone preview component isolated from later phases", () => {
    const source = readFileSync(
      path.join(
        process.cwd(),
        "src/components/shop/frame-preview/FramedArtworkPreview.tsx"
      ),
      "utf8"
    );

    expect(source).not.toMatch(/useState|useEffect|onClick/);
    expect(source).not.toMatch(/@\/lib\/api\/shopify|@\/lib\/data\/services/);
    expect(source).not.toMatch(/@\/lib\/data\/models|@\/lib\/db/);
    expect(source).not.toMatch(/project\/contact|checkout|cart/i);
    expect(source).not.toMatch(/FramedPrintPreviewModal|prototype\/frame/);
  });
});

describe("RoomFramedArtworkPreview", () => {
  it("keeps the framed artwork hidden until the room background has loaded", () => {
    render(
      <RoomFramedArtworkPreview
        artwork={artwork}
        roomScene={{
          id: "test-room",
          label: "Test room",
          imageSrc: "/test-room.jpg",
          imageAlt: "Test room background",
        }}
        frameProfile={FRAME_PROFILES[0]}
        matProfile={MAT_PROFILES[1]}
        bounds={{ maxWidthPx: 220, maxHeightPx: 170 }}
        unoptimized
      />
    );

    const hangingZone = screen.getByTestId(
      "room-framed-preview-hanging-zone"
    );

    expect(hangingZone).toHaveAttribute("data-background-ready", "false");
    expect(hangingZone).toHaveClass("opacity-0");
    expect(screen.getByRole("img", { name: "Test room background" }))
      .toHaveAttribute("src", "/test-room.jpg");

    fireEvent.load(screen.getByRole("img", { name: "Test room background" }));

    expect(hangingZone).toHaveAttribute("data-background-ready", "true");
    expect(hangingZone).toHaveClass("opacity-100");
    expect(
      screen.getByRole("figure", { name: "Framed preview of Test artwork" })
    ).toBeInTheDocument();
  });
});
