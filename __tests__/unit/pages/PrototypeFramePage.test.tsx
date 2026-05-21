/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "fs";
import path from "path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import PrototypeFramePage, { metadata } from "@/app/prototype/frame/page";
import { FramePreviewPrototype } from "@/components/prototypes/frame/FramePreviewPrototype";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) => (
    <img src={String(src)} alt={String(alt)} {...props} />
  ),
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

  it("renders fixture artwork shapes and frame material choices", () => {
    render(<FramePreviewPrototype />);

    const shapeControls = screen.getByLabelText("Artwork shape samples");
    for (const shape of ["Portrait", "Landscape", "Square", "Wide"]) {
      expect(
        within(shapeControls).getByRole("button", { name: shape })
      ).toBeInTheDocument();
      expect(screen.getAllByText(shape).length).toBeGreaterThanOrEqual(2);
    }

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
  });

  it("updates the visible preview from fixture controls", () => {
    render(<FramePreviewPrototype />);

    const figure = screen
      .getAllByRole("figure", {
        name: "Framed preview of Portrait artwork frame preview sample",
      })
      .find(
        (preview) => preview.getAttribute("data-mat-profile-id") === "warm-white"
      );

    expect(figure).toHaveAttribute("data-frame-profile-id", "black-wood-thin");

    fireEvent.click(screen.getByRole("button", { name: "Landscape" }));

    expect(
      screen.getAllByRole("figure", {
        name: "Framed preview of Landscape artwork frame preview sample",
      }).length
    ).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Walnut" }));

    expect(
      screen
        .getAllByRole("figure", {
          name: "Framed preview of Landscape artwork frame preview sample",
        })
        .find(
          (preview) =>
            preview.getAttribute("data-mat-profile-id") === "warm-white"
        )
    ).toHaveAttribute("data-frame-profile-id", "walnut-medium");
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
