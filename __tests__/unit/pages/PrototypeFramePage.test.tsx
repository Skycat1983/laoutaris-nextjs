/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "fs";
import path from "path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import PrototypeFramePage, { metadata } from "@/app/prototype/frame/page";
import { FramePreviewPrototype } from "@/components/prototypes/frame/FramePreviewPrototype";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    priority,
    ...props
  }: Record<string, unknown>) => {
    void fill;
    void priority;

    return <img src={String(src)} alt={String(alt)} {...props} />;
  },
}));

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("/prototype/frame page", () => {
  it("marks the prototype route noindex", () => {
    expect(metadata).toMatchObject({
      title: "Frame Preview Prototype",
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
    });
  });

  it("renders an isolated frame prototype shell", () => {
    render(<PrototypeFramePage />);

    expect(screen.getByRole("main")).toHaveAttribute(
      "data-testid",
      "prototype-frame-page"
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Frame Preview Prototype",
      })
    ).toHaveClass("sr-only");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Frame preview",
      })
    ).toBeInTheDocument();
  });

  it("renders fixture artwork samples, frame materials, and mat margin choices", () => {
    render(<FramePreviewPrototype />);

    const sampleControls = screen.getByLabelText("Artwork samples");
    for (const sample of ["Sample A", "Sample B", "Sample C", "Sample D"]) {
      expect(
        within(sampleControls).getByRole("button", { name: sample })
      ).toBeInTheDocument();
      expect(screen.getAllByText(sample).length).toBeGreaterThanOrEqual(2);
    }
    expect(screen.queryByText("Portrait")).not.toBeInTheDocument();
    expect(screen.queryByText("Landscape")).not.toBeInTheDocument();

    const materialControls = screen.getByLabelText("Frame material samples");
    for (const material of [
      "Black Wood",
      "White Wood",
      "Natural Oak",
      "Walnut",
      "Brushed Metal",
    ]) {
      expect(
        within(materialControls).getByRole("button", { name: material })
      ).toBeInTheDocument();
    }

    const matControls = screen.getByLabelText("Mat margin presets");
    for (const margin of ["No Mat", "Warm White Mat", "Wide Gallery Mat"]) {
      expect(
        within(matControls).getByRole("button", { name: margin })
      ).toBeInTheDocument();
    }

    const roomControls = screen.getByLabelText("Room background samples");
    for (const room of [
      "Modern Gallery",
      "Scandinavian Living",
      "Townhouse Study",
      "Plaster Hallway",
    ]) {
      expect(
        within(roomControls).getByRole("button", { name: room })
      ).toBeInTheDocument();
    }
  });

  it("updates the visible preview from fixture controls", () => {
    render(<FramePreviewPrototype />);

    const figure = screen
      .getAllByRole("figure", {
        name: "Framed preview of Sample A artwork frame preview",
      })
      .find(
        (preview) => preview.getAttribute("data-mat-profile-id") === "warm-white"
      );

    expect(figure).toHaveAttribute("data-frame-profile-id", "black-wood-thin");
    expect(figure).toHaveAttribute("data-render-mode", "rails");

    fireEvent.click(screen.getByRole("button", { name: "Sample B" }));

    expect(
      screen.getAllByRole("figure", {
        name: "Framed preview of Sample B artwork frame preview",
      }).length
    ).toBeGreaterThan(0);

    expect(screen.getByTestId("prototype-frame-room-scene")).toBeInTheDocument();
    expect(
      screen.getByAltText("Modern white gallery-style living room wall background")
    ).toHaveAttribute(
      "src",
      "/prototypes/frame-backgrounds/modern-gallery-wall.png"
    );

    fireEvent.click(screen.getByRole("button", { name: "Townhouse Study" }));

    expect(
      screen.getByAltText("Modern white gallery-style living room wall background")
    ).toHaveAttribute(
      "src",
      "/prototypes/frame-backgrounds/modern-gallery-wall.png"
    );
    expect(screen.getByTestId("prototype-frame-room-scene")).toHaveAttribute(
      "data-room-transitioning",
      "true"
    );
    expect(screen.getByTestId("prototype-frame-room-preloader")).toHaveAttribute(
      "src",
      "/prototypes/frame-backgrounds/townhouse-study-wall.png"
    );

    fireEvent.load(screen.getByTestId("prototype-frame-room-preloader"));

    expect(
      screen.getByAltText("Older townhouse study wall background")
    ).toHaveAttribute(
      "src",
      "/prototypes/frame-backgrounds/townhouse-study-wall.png"
    );
    expect(
      screen.getByTestId("prototype-frame-room-hanging-zone")
    ).toHaveStyle({
      left: "52%",
      top: "42%",
      width: "22%",
    });
    expect(screen.getByTestId("prototype-frame-room-scene")).toHaveAttribute(
      "data-room-transitioning",
      "false"
    );

    fireEvent.click(screen.getByRole("button", { name: "Walnut" }));
    fireEvent.click(screen.getByRole("button", { name: "Wide Gallery Mat" }));

    expect(
      screen
        .getAllByRole("figure", {
          name: "Framed preview of Sample B artwork frame preview",
        })
        .find(
          (preview) =>
            preview.getAttribute("data-mat-profile-id") ===
            "gallery-white-wide"
        )
    ).toHaveAttribute("data-frame-profile-id", "walnut-medium");

    expect(
      screen.getAllByTestId("framed-preview-miter-seam").length
    ).toBeGreaterThanOrEqual(4);
  });

  it("keeps sample artwork frame ratios aligned to the loaded assets", () => {
    render(<FramePreviewPrototype />);

    fireEvent.click(screen.getByRole("button", { name: "Sample D" }));

    const sampleDImages = screen.getAllByRole("img", {
      name: "Sample D artwork frame preview",
    });

    for (const sampleDImage of sampleDImages) {
      expect(Number.parseFloat(sampleDImage.style.height)).toBeGreaterThan(
        Number.parseFloat(sampleDImage.style.width)
      );
    }
  });

  it("opens and closes the modal preview without product-page behavior", () => {
    render(<FramePreviewPrototype />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Open modal preview" })
    );

    expect(
      screen.getByRole("dialog", { name: "Frame Preview Prototype" })
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByRole("dialog", { name: "Frame Preview Prototype" })
      ).getByRole("figure", {
        name: "Framed preview of Sample A artwork frame preview",
      })
    ).toHaveAttribute("data-render-mode", "rails");
    expect(
      screen.queryByText(/checkout|cart|enquire|buy framed/i)
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close frame preview" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the prototype route isolated from live routes and data services", () => {
    const pageSource = readRepoFile("src/app/prototype/frame/page.tsx");
    const prototypeSource = readRepoFile(
      "src/components/prototypes/frame/FramePreviewPrototype.tsx"
    );
    const source = `${pageSource}\n${prototypeSource}`;

    expect(source).not.toMatch(/prototype\/home|HomePrototype/);
    expect(source).not.toMatch(/@\/lib\/api\/shopify|@\/lib\/data\/services/);
    expect(source).not.toMatch(/@\/lib\/data\/models|@\/lib\/db/);
    expect(source).not.toMatch(/project\/contact|checkout|cart/i);
    expect(pageSource).toContain("index: false");
    expect(pageSource).not.toMatch(/navigation|MainNav|Footer/);
  });
});
