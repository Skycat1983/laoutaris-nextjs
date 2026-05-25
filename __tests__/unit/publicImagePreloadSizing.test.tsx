/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "fs";
import path from "path";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MagnifierImage } from "@/components/modules/MagnifierImage";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) => (
    <img src={String(src)} alt={String(alt)} {...props} />
  ),
}));

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const getSourceBetween = (source: string, start: string, end: string) => {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);

  expect(startIndex).toBeGreaterThanOrEqual(0);
  expect(endIndex).toBeGreaterThan(startIndex);

  return source.slice(startIndex, endIndex);
};

type MockZoomImage = {
  width?: number;
  height?: number;
  onload: (() => void) | null;
  src: string;
  _src?: string;
};

describe("public image preload and sizing", () => {
  let originalWindowImage: typeof window.Image;

  beforeEach(() => {
    originalWindowImage = window.Image;
  });

  afterEach(() => {
    Object.defineProperty(window, "Image", {
      configurable: true,
      writable: true,
      value: originalWindowImage,
    });
    jest.restoreAllMocks();
  });

  it("keeps only the initially visible home hero image prioritized", () => {
    const filterableSource = readRepoFile(
      "src/components/modules/hero/slides/FilterableArtworks.tsx"
    );
    const initialHeroSource = getSourceBetween(
      filterableSource,
      "const FilterableArtworks = () =>",
      "export { FilterableArtworks, FilterableArtworks2 };"
    );
    const inactiveHeroSource = getSourceBetween(
      filterableSource,
      "const FilterableArtworks2 = () =>",
      "Search Collection"
    );

    expect(initialHeroSource).toContain("priority");
    expect(initialHeroSource).toContain('sizes="100vw"');
    expect(initialHeroSource).not.toContain("quality={100}");
    expect(inactiveHeroSource).toContain('sizes="100vw"');
    expect(inactiveHeroSource).not.toContain("priority");
    expect(inactiveHeroSource).not.toContain("quality={100}");

    const nonInitialHeroSizes = new Map([
      ["src/components/modules/hero/slides/ComingSoon.tsx", 'sizes="55vw"'],
      ["src/components/modules/hero/slides/LargeScaleWorks.tsx", 'sizes="100vw"'],
      [
        "src/components/modules/hero/slides/FamilyFavourites.tsx",
        'sizes="100vw"',
      ],
    ]);

    nonInitialHeroSizes.forEach((expectedSizes, sourcePath) => {
      const source = readRepoFile(sourcePath);

      expect(source).not.toContain("priority={true}");
      expect(source).not.toContain("quality={100}");
      expect(source).toContain(expectedSizes);
    });
  });

  it("keeps touched shop fill images explicitly sized", () => {
    const productListSource = readRepoFile("src/app/shop/products/page.tsx");
    const productDetailSource = readRepoFile(
      "src/app/shop/products/[productHandle]/page.tsx"
    );
    const productSaleGallerySource = readRepoFile(
      "src/components/shop/product-detail/ShopProductSaleGallery.tsx"
    );

    expect(productListSource).toContain(
      'sizes="(max-width: 1024px) 100vw, 640px"'
    );
    expect(productDetailSource).toContain("<ShopProductSaleGallery");
    expect(productSaleGallerySource).toContain('sizes="112px"');
    expect(productSaleGallerySource).toContain(
      'sizes="(max-width: 1279px) 100vw, 45vw"'
    );
    expect(productSaleGallerySource).toContain(
      'options.thumbnail ? "112px" : "(max-width: 1279px) 100vw, 45vw"'
    );
    expect(productDetailSource).toContain(
      'sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 288px"'
    );
  });

  it("loads the magnifier zoom image after user intent instead of on mount", () => {
    const mockWindowImage = jest
      .fn()
      .mockImplementation(function (
        this: MockZoomImage,
        width?: number,
        height?: number
      ) {
        this.width = width;
        this.height = height;
        this.onload = null;
        Object.defineProperty(this, "src", {
          configurable: true,
          get() {
            return this._src ?? "";
          },
          set(value: string) {
            this._src = value;
          },
        });
      });

    Object.defineProperty(window, "Image", {
      configurable: true,
      writable: true,
      value: mockWindowImage,
    });

    render(
      <MagnifierImage
        src="https://res.cloudinary.com/demo/image/upload/artwork.jpg"
        width={400}
        height={300}
        alt="Artwork"
        magnificationLevel={4}
      />
    );

    expect(mockWindowImage).not.toHaveBeenCalled();

    const imageWrapper = screen.getByAltText("Artwork").parentElement;
    expect(imageWrapper).not.toBeNull();

    fireEvent.mouseEnter(imageWrapper as HTMLElement);

    expect(mockWindowImage).toHaveBeenCalledTimes(1);
    expect(mockWindowImage).toHaveBeenCalledWith(1600, 1200);
    expect(screen.getByText("Loading zoom...")).toBeInTheDocument();

    const zoomImage = mockWindowImage.mock.instances[0] as MockZoomImage;
    expect(zoomImage.src).toBe(
      "https://res.cloudinary.com/demo/image/upload/artwork.jpg"
    );

    act(() => {
      zoomImage.onload?.();
    });

    fireEvent.focus(imageWrapper as HTMLElement);

    expect(mockWindowImage).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Loading zoom...")).not.toBeInTheDocument();
  });
});
