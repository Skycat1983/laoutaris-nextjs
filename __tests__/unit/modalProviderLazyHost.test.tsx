import fs from "fs";
import path from "path";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  GlobalFeaturesProvider,
  useGlobalFeatures,
} from "@/contexts/GlobalFeaturesContext";

const readSource = (sourcePath: string) =>
  fs.readFileSync(path.join(process.cwd(), sourcePath), "utf8");

function ModalProbe({ onClosed }: { onClosed: () => void }) {
  const modal = useGlobalFeatures();
  const hasLanguageState =
    "language" in (modal as unknown as Record<string, unknown>);

  return (
    <div>
      <span data-testid="open-state">{String(modal.isOpen)}</span>
      <span data-testid="has-language-state">{String(hasLanguageState)}</span>
      <div data-testid="modal-content">{modal.modalContent}</div>
      <button
        type="button"
        onClick={() => modal.openModal(<span>Opened content</span>, onClosed)}
      >
        Open modal
      </button>
      <button
        type="button"
        onClick={() => modal.setModalContent(<span>Updated content</span>)}
      >
        Update content
      </button>
      <button type="button" onClick={modal.closeModal}>
        Close modal
      </button>
    </div>
  );
}

describe("modal provider and lazy host", () => {
  it("keeps the global provider modal-only while preserving modal API behavior", () => {
    const onClosed = jest.fn();

    render(
      <GlobalFeaturesProvider>
        <ModalProbe onClosed={onClosed} />
      </GlobalFeaturesProvider>
    );

    expect(screen.getByTestId("open-state")).toHaveTextContent("false");
    expect(screen.getByTestId("has-language-state")).toHaveTextContent("false");

    fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    expect(screen.getByTestId("open-state")).toHaveTextContent("true");
    expect(screen.getByText("Opened content")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Update content" }));

    expect(screen.getByText("Updated content")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

    expect(screen.getByTestId("open-state")).toHaveTextContent("false");
    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it("keeps language state out of the root modal provider path", () => {
    const providerSource = readSource("src/contexts/GlobalFeaturesContext.tsx");
    const translatedContentSource = readSource(
      "src/components/compositions/TranslatedContent.tsx"
    );

    expect(providerSource).not.toContain("useLanguage");
    expect(providerSource).not.toContain("UseLanguageValues");
    expect(providerSource).not.toContain("changeLanguage");
    expect(translatedContentSource).toContain('from "@/hooks/useLanguage"');
    expect(translatedContentSource).not.toContain("useGlobalFeatures");
  });

  it("lazy-loads the Headless UI dialog outside the initial modal host", () => {
    const rootLayoutSource = readSource("src/app/layout.tsx");
    const modalHostSource = readSource("src/components/modules/modal/Modal.tsx");
    const modalDialogSource = readSource(
      "src/components/modules/modal/ModalDialog.tsx"
    );

    expect(rootLayoutSource).toContain(
      'from "@/components/modules/modal/Modal"'
    );
    expect(modalHostSource).toContain("lazy(async ()");
    expect(modalHostSource).toContain("<Suspense fallback={null}>");
    expect(modalHostSource).toContain("hasModalIntent");
    expect(modalHostSource).not.toContain("@headlessui/react");
    expect(modalHostSource).not.toContain("ssr: false");
    expect(modalDialogSource).toContain("@headlessui/react");
  });

  it("keeps SessionProvider and modal provider ownership at the root boundary", () => {
    const boundarySource = readSource("src/contexts/ClientContextBoundary.tsx");

    expect(boundarySource).toContain('from "next-auth/react"');
    expect(boundarySource).toContain("SessionProvider");
    expect(boundarySource).toContain("GlobalFeaturesProvider");
  });
});
