export const semanticStyles = {
  text: {
    pageTitle: "text-5xl font-bold",
    displayTitle:
      "font-cormorant text-5xl font-semibold leading-none text-slate sm:text-6xl lg:text-7xl xl:text-[82px] 2xl:text-[96px]",
    sectionHeading: "text-4xl font-archivo font-semibold",
    cardTitle: "text-lg font-semibold mb-2 line-clamp-2",
    body: "text-gray-700 leading-relaxed",
    bodyMuted: "text-sm text-gray-600",
    caption: "text-sm text-gray-500",
    eyebrow: "font-archivo text-xs uppercase text-slate/80",
  },
  action: {
    primary:
      "block w-full rounded-md bg-black px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-gray-800",
    secondary:
      "inline-flex min-h-[56px] w-full max-w-[240px] items-center justify-between border border-slate px-7 font-archivo text-base font-semibold text-slate transition-colors hover:bg-slate hover:text-whitish focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate",
    textLink:
      "border-b border-[#9a713d] pb-2 font-archivo text-sm uppercase text-[#9a713d] transition-colors hover:text-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate",
  },
  layout: {
    pageFrame: "max-w-7xl mx-auto px-4",
    sectionBand: "w-full border-t border-slate/10 bg-whitish text-slate",
    contentRail: "max-w-xl",
  },
  surface: {
    card: "relative group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all",
    mediaFrame: "relative aspect-square mb-2 overflow-hidden rounded-md",
  },
} as const;

export type SemanticStyles = typeof semanticStyles;
