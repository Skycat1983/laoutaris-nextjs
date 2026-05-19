/* eslint-disable @next/next/no-img-element */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TailwindColorIcon } from "@/components/elements/icons/TailwindColorIcon";
import { ArtworkFeedCard } from "@/components/modules/cards/ArtworkFeedCard";
import { translations } from "@/lib/translations";
import { getTranslation } from "@/lib/utils/translationUtils";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />,
}));

const clipboardWriteMock = jest.fn();

Object.defineProperty(global.navigator, "clipboard", {
  value: { writeText: clipboardWriteMock },
  writable: true,
});

describe("shared fetcher and utility fallback behavior", () => {
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    delete translations["test.missingLanguage"];
  });

  afterEach(() => {
    delete translations["test.missingLanguage"];
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("returns the key for missing translation keys without warning", () => {
    expect(getTranslation("test.missingKey", "en")).toBe("test.missingKey");
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("returns the key for missing language variants without warning", () => {
    translations["test.missingLanguage"] = {
      en: "English",
      de: "Deutsch",
    } as (typeof translations)[string];

    expect(getTranslation("test.missingLanguage", "fr")).toBe(
      "test.missingLanguage"
    );
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("renders no color icon for unknown colors without warning", () => {
    const { container } = render(<TailwindColorIcon color="mauve" />);

    expect(container).toBeEmptyDOMElement();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("keeps artwork-card copy failures silent without changing the copy attempt", async () => {
    clipboardWriteMock.mockRejectedValueOnce(new Error("Clipboard denied"));

    render(
      <ArtworkFeedCard
        item={
          {
            _id: "artwork-123",
            title: "Studio study",
            image: {
              secure_url:
                "https://res.cloudinary.com/demo/image/upload/artwork.jpg",
            },
            medium: "Oil",
            surface: "Canvas",
            decade: "1980s",
          } as never
        }
      />
    );

    fireEvent.click(screen.getByTitle("Copy ID"));

    await waitFor(() =>
      expect(clipboardWriteMock).toHaveBeenCalledWith("artwork-123")
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
