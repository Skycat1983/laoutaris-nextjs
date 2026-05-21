import type { Metadata } from "next";
import { FramePreviewPrototype } from "@/components/prototypes/frame/FramePreviewPrototype";

export const metadata: Metadata = {
  title: "Frame Preview Prototype",
  description:
    "Noindex workshop route for framed print preview materials, proportions, and modal controls.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PrototypeFramePage() {
  return (
    <main
      className="min-h-screen bg-stone-50 text-gray-950"
      data-testid="prototype-frame-page"
    >
      <h1 className="sr-only">Frame Preview Prototype</h1>
      <FramePreviewPrototype />
    </main>
  );
}
