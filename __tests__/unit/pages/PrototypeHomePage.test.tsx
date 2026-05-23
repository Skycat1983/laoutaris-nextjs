/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "fs";
import path from "path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import PrototypeHomePage, { metadata } from "@/app/prototype/home/page";
import { HomePrototype } from "@/components/prototypes/home/HomePrototype";
import { BiographyPrototypeSection } from "@/components/prototypes/home/BiographyPrototypeSection";
import { getBiographyPrototypeArticles } from "@/components/prototypes/home/BiographyPrototypeLoader";
import { BlogPrototypeSection } from "@/components/prototypes/home/BlogPrototypeSection";
import { getBlogPrototypeEntries } from "@/components/prototypes/home/BlogPrototypeLoader";
import { CollectionPrototypeSection } from "@/components/prototypes/home/CollectionPrototypeSection";
import { getCollectionPrototypeEntries } from "@/components/prototypes/home/CollectionPrototypeLoader";
import { ShopPrototypeSection } from "@/components/prototypes/home/ShopPrototypeSection";
import { getShopPrototypeProducts } from "@/components/prototypes/home/ShopPrototypeLoader";
import type { SimpleProduct } from "@/lib/data/types/shopify";

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

const mockEmblaApi = {
  selectedScrollSnap: jest.fn(() => 0),
  on: jest.fn(),
  off: jest.fn(),
  scrollPrev: jest.fn(),
  scrollNext: jest.fn(),
  scrollTo: jest.fn(),
};

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: jest.fn(() => [jest.fn(), mockEmblaApi]),
}));

jest.mock("@/components/prototypes/home/BlogPrototypeLoader", () => ({
  getBlogPrototypeEntries: jest.fn(),
}));

jest.mock("@/components/prototypes/home/BiographyPrototypeLoader", () => ({
  getBiographyPrototypeArticles: jest.fn(),
}));

jest.mock("@/components/prototypes/home/ShopPrototypeLoader", () => ({
  getShopPrototypeProducts: jest.fn(),
}));

jest.mock("@/components/prototypes/home/CollectionPrototypeLoader", () => ({
  getCollectionPrototypeEntries: jest.fn(),
}));

jest.mock("@/lib/images/cloudinaryDelivery", () => ({
  getCloudinaryDeliveryUrl: (src?: string) => src ?? "",
}));

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const mockGetBlogPrototypeEntries =
  getBlogPrototypeEntries as jest.MockedFunction<typeof getBlogPrototypeEntries>;
const mockGetBiographyPrototypeArticles =
  getBiographyPrototypeArticles as jest.MockedFunction<
    typeof getBiographyPrototypeArticles
  >;
const mockGetShopPrototypeProducts =
  getShopPrototypeProducts as jest.MockedFunction<
    typeof getShopPrototypeProducts
  >;
const mockGetCollectionPrototypeEntries =
  getCollectionPrototypeEntries as jest.MockedFunction<
    typeof getCollectionPrototypeEntries
  >;

const createBlog = (
  slug: string,
  title: string,
  subtitle?: string,
  displayDate: Date | string = "2023-04-14T00:00:00.000Z"
) =>
  ({
    slug,
    title,
    subtitle: subtitle ?? "",
    summary: `${title} archive summary`,
    imageUrl: `https://res.cloudinary.com/dzncmfirr/image/upload/${slug}.jpg`,
    displayDate,
  }) as never;

const createBiographyArticle = (
  slug: string,
  title: string,
  subtitle: string
) =>
  ({
    slug,
    title,
    subtitle,
    imageUrl: `https://res.cloudinary.com/dzncmfirr/image/upload/${slug}.jpg`,
  }) as never;

const createCollection = (
  slug: string,
  title: string,
  firstArtworkId: string | null = `${slug}-artwork`
) =>
  ({
    slug,
    title,
    subtitle: `${title} subtitle`,
    summary: `${title} summary`,
    text: `${title} text`,
    imageUrl: `https://res.cloudinary.com/dzncmfirr/image/upload/${slug}.jpg`,
    section: "collections",
    artworkCount: 4,
    firstArtworkId,
  }) as never;

const createProduct = (
  handle: string,
  title: string,
  overrides: Partial<SimpleProduct> = {}
): SimpleProduct => ({
  id: `gid://shopify/Product/${handle}`,
  handle,
  title,
  description: `${title} product description`,
  descriptionHtml: `<p>${title} product description</p>`,
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: ["oil on canvas", "archive"],
  price: "18000.00",
  currencyCode: "EUR",
  compareAtPrice: null,
  image: {
    url: `https://res.cloudinary.com/dzncmfirr/image/upload/${handle}.jpg`,
    altText: `${title} artwork`,
  },
  availableForSale: true,
  variants: [],
  ...overrides,
});

describe("/prototype/home page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmblaApi.selectedScrollSnap.mockReturnValue(0);
    mockGetBiographyPrototypeArticles.mockResolvedValue([
      createBiographyArticle(
        "early-years",
        "Early Years",
        "First Encounters with Art"
      ),
    ]);
    mockGetBlogPrototypeEntries.mockResolvedValue([
      createBlog("lead-story", "Lead Story", "Lead blog subtitle"),
      createBlog("studio-note", "Studio Note"),
    ]);
    mockGetCollectionPrototypeEntries.mockResolvedValue([
      createCollection("extra-large", "Extra Large", "art-1"),
      createCollection(
        "grandads-living-room",
        "Grandad's Living Room",
        "art-2"
      ),
    ]);
    mockGetShopPrototypeProducts.mockResolvedValue({
      products: [createProduct("yellow-composition", "Yellow Composition")],
      hasLoadError: false,
    });
  });

  it("marks the prototype route noindex", () => {
    expect(metadata).toMatchObject({
      title: "Homepage Prototype",
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
    });
  });

  it("renders an isolated page shell with a single route-owned main landmark", async () => {
    render(await PrototypeHomePage());

    expect(screen.getByRole("main")).toHaveAttribute(
      "data-testid",
      "prototype-home-page"
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Homepage Prototype",
      })
    ).toHaveClass("sr-only");
    expect(mockGetBiographyPrototypeArticles).toHaveBeenCalledTimes(1);
    expect(mockGetBlogPrototypeEntries).toHaveBeenCalledTimes(1);
    expect(mockGetCollectionPrototypeEntries).toHaveBeenCalledTimes(1);
    expect(mockGetShopPrototypeProducts).toHaveBeenCalledTimes(1);
    expect(
      screen.getByTestId("prototype-collections-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("prototype-shop-section")).toBeInTheDocument();
  });

  it("renders full-width prototype sections for hero and public navbar categories", () => {
    render(<HomePrototype />);

    for (const section of [
      "hero",
      "collections",
      "biography",
      "blog",
      "project",
      "shop",
    ]) {
      expect(
        screen.getByTestId(`prototype-${section}-section`)
      ).toBeInTheDocument();
    }
    expect(
      screen.queryByTestId("prototype-artwork-section")
    ).not.toBeInTheDocument();
  });

  it("renders fixed bottom dropdown controls for frame, headings, and shop item size", () => {
    render(
      <HomePrototype
        shopProducts={[
          createProduct("yellow-composition", "Yellow Composition"),
          createProduct("orange-form", "Orange Form"),
        ]}
      />
    );

    const prototype = screen.getByTestId("prototype-home");
    const controlRail = screen.getByTestId("prototype-home-controls");
    const productRail = screen.getByTestId("prototype-shop-product-rail");
    expect(controlRail).toBeInTheDocument();
    expect(controlRail).toHaveClass("hidden", "lg:block");
    expect(prototype).toHaveClass("lg:pb-28");
    expect(prototype).not.toHaveClass("pb-48", "sm:pb-36");
    expect(prototype).toHaveAttribute("data-frame-preset", "wide");
    expect(prototype).toHaveAttribute("data-font-preset", "smaller");
    expect(prototype).toHaveAttribute(
      "data-alternate-background-preset",
      "stone"
    );
    expect(prototype).toHaveStyle({
      "--prototype-home-frame-max": "1920px",
      "--prototype-home-heading-scale": "0.9",
      "--prototype-home-alt-bg": "#eeece6",
    });
    expect(productRail).toHaveAttribute("data-size-preset", "feature");

    fireEvent.change(screen.getByRole("combobox", { name: "Frame" }), {
      target: { value: "inset" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Headings" }), {
      target: { value: "compact" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Shop items" }), {
      target: { value: "large" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Alt bg" }), {
      target: { value: "ivory" },
    });

    expect(prototype).toHaveAttribute("data-frame-preset", "inset");
    expect(prototype).toHaveAttribute("data-font-preset", "compact");
    expect(prototype).toHaveAttribute(
      "data-alternate-background-preset",
      "ivory"
    );
    expect(prototype).toHaveStyle({
      "--prototype-home-frame-max": "1180px",
      "--prototype-home-heading-scale": "0.82",
      "--prototype-home-alt-bg": "#f6f5f1",
    });
    expect(productRail).toHaveAttribute("data-size-preset", "large");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reset prototype layout controls",
      })
    );

    expect(prototype).toHaveAttribute("data-frame-preset", "wide");
    expect(prototype).toHaveAttribute("data-font-preset", "smaller");
    expect(prototype).toHaveAttribute(
      "data-alternate-background-preset",
      "stone"
    );
    expect(prototype).toHaveStyle({
      "--prototype-home-frame-max": "1920px",
      "--prototype-home-heading-scale": "0.9",
      "--prototype-home-alt-bg": "#eeece6",
    });
    expect(productRail).toHaveAttribute("data-size-preset", "feature");
  });

  it("adds the mobile documentary prototype while preserving the desktop project video", () => {
    render(<HomePrototype />);

    const projectSection = screen.getByTestId("prototype-project-section");
    const mobileProject = within(projectSection).getByTestId(
      "prototype-mobile-project"
    );
    const desktopProject = within(projectSection).getByTestId(
      "prototype-desktop-project"
    );
    const projectVideo = within(projectSection).getByTestId(
      "prototype-project-video"
    );
    const mobileProjectVideo = within(projectSection).getByTestId(
      "prototype-mobile-project-video"
    );
    const iframe = within(projectVideo).getByTitle("YouTube video player");
    const mobileIframe =
      within(mobileProjectVideo).getByTitle("YouTube video player");

    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/6ynF2gO-J30?rel=0"
    );
    expect(mobileIframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/6ynF2gO-J30?rel=0"
    );
    expect(mobileProject).toHaveClass("md:hidden");
    expect(desktopProject).toHaveClass("hidden", "md:block");
    expect(projectSection).toHaveTextContent("Project:");
    expect(projectSection).toHaveTextContent("Project");
    expect(projectSection).toHaveTextContent("Watch the documentary");
    expect(projectSection).toHaveTextContent(
      "A short film exploring the life, ethos, and regrets of Joseph Laoutaris."
    );
    expect(projectSection).toHaveTextContent(
      "The life, ethos & regrets of Joseph Laoutaris"
    );
    expect(projectSection).toHaveTextContent(
      "A short film about my grandfather"
    );
    expect(projectSection).toHaveTextContent("By Heron Laoutaris");
    expect(
      within(mobileProject).getByRole("link", {
        name: /Watch on film page/i,
      })
    ).toHaveAttribute("href", "/project/film");
  });

  it("uses the route-local wider prototype frame instead of the earlier bounded section caps", () => {
    const layoutSource = readRepoFile(
      "src/components/prototypes/home/prototypeHomeLayout.ts"
    );
    const homeSource = readRepoFile(
      "src/components/prototypes/home/HomePrototype.tsx"
    );
    const sectionSource = [
      "src/components/prototypes/home/BiographyPrototypeSection.tsx",
      "src/components/prototypes/home/BlogPrototypeSection.tsx",
      "src/components/prototypes/home/CollectionPrototypeSection.tsx",
      "src/components/prototypes/home/ShopPrototypeSection.tsx",
      "src/components/prototypes/home/PrototypeSectionPlaceholder.tsx",
    ]
      .map(readRepoFile)
      .join("\n");

    expect(layoutSource).toContain("--prototype-home-frame-max");
    expect(layoutSource).toContain("1920px");
    expect(layoutSource).toContain("prototypeSectionEyebrowClassName");
    expect(homeSource).toContain("1180px");
    expect(homeSource).toContain("prototype-home-section-heading");
    expect(homeSource).toContain(
      "--prototype-home-primary-accent-color: #262626"
    );
    expect(homeSource).toContain(
      "--prototype-home-alt-accent-color: #5b4a3b"
    );
    expect(sectionSource).not.toContain("max-w-[1440px]");
    expect(sectionSource).not.toContain("max-w-[1536px]");
    expect(sectionSource).not.toContain("prototype-home-heading");
    expect(
      sectionSource.split("className={`${prototypeSectionFrameClassName}")
        .length - 1
    ).toBe(6);
  });

  it("keeps prototype section labels visually consistent", () => {
    const sectionSource = [
      "src/components/prototypes/home/BiographyPrototypeSection.tsx",
      "src/components/prototypes/home/BlogPrototypeSection.tsx",
      "src/components/prototypes/home/CollectionPrototypeSection.tsx",
      "src/components/prototypes/home/ShopPrototypeSection.tsx",
      "src/components/prototypes/home/PrototypeSectionPlaceholder.tsx",
    ]
      .map(readRepoFile)
      .join("\n");

    render(<BiographyPrototypeSection articles={[]} />);

    expect(screen.getByText("Biography")).toHaveClass(
      "font-archivo",
      "text-sm",
      "uppercase",
      "tracking-[0.14em]",
      "prototype-home-accent-text"
    );
    expect(screen.queryByText("Biography:")).not.toBeInTheDocument();
    expect(sectionSource).not.toContain(
      "font-archivo text-3xl font-semibold leading-none text-black"
    );
    expect(sectionSource).not.toContain("Biography:");
    expect(sectionSource).toContain("prototypeSectionEyebrowClassName");
    expect(sectionSource).toContain("prototypeSectionMutedEyebrowClassName");
  });

  it("renders the prototype biography section with real article links", () => {
    render(
      <BiographyPrototypeSection
        articles={[
          createBiographyArticle(
            "obituary",
            "Obituary",
            "Final archive remembrance"
          ),
          createBiographyArticle(
            "later-years",
            "Later Years",
            "Resignation and Disappointment"
          ),
          createBiographyArticle("ethos", "Ethos", "A way of working"),
          createBiographyArticle(
            "meeting-beryl",
            "Meeting Beryl",
            "Legacy of Love and Loss"
          ),
          createBiographyArticle(
            "early-years",
            "Early Years",
            "First Encounters with Art"
          ),
        ]}
      />
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Read my grandfather's story",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read more/i })).toHaveAttribute(
      "href",
      "/biography"
    );
    const desktopBiography = screen.getByTestId("prototype-desktop-biography");
    expect(
      within(desktopBiography).getByTestId("prototype-biography-featured-card")
    ).toHaveTextContent("Early Years");
    expect(
      within(desktopBiography)
        .getAllByTestId("prototype-biography-card")
        .map(
          (card) =>
            within(card).getByRole("heading", { level: 3 }).textContent
        )
    ).toEqual(["Meeting Beryl", "Ethos", "Later Years", "Obituary"]);
    expect(
      within(desktopBiography).getByRole("link", { name: /Early Years/i })
    ).toHaveAttribute("href", "/biography/early-years");
    expect(
      screen.getByRole("link", { name: /Meeting Beryl/i })
    ).toHaveAttribute("href", "/biography/meeting-beryl");
    expect(screen.getByRole("link", { name: /Ethos/i })).toHaveAttribute(
      "href",
      "/biography/ethos"
    );
    expect(screen.getAllByText("03").length).toBeGreaterThan(0);
  });

  it("renders the mobile biography mockup with accessible story selection", () => {
    render(
      <BiographyPrototypeSection
        articles={[
          createBiographyArticle(
            "obituary",
            "Obituary",
            "Final archive remembrance"
          ),
          createBiographyArticle(
            "later-years",
            "Later Years",
            "Resignation and Disappointment"
          ),
          createBiographyArticle("ethos", "Ethos", "A way of working"),
          createBiographyArticle(
            "meeting-beryl",
            "Meeting Beryl",
            "Legacy of Love and Loss"
          ),
          createBiographyArticle(
            "early-years",
            "Early Years",
            "First Encounters with Art"
          ),
        ]}
      />
    );

    const mobileBiography = screen.getByTestId("prototype-mobile-biography");
    const activeCard = within(mobileBiography).getByTestId(
      "prototype-mobile-biography-featured-card"
    );
    const thumbnailGrid = within(mobileBiography).getByTestId(
      "prototype-mobile-biography-thumbnail-grid"
    );

    expect(activeCard).toHaveTextContent("Early Years");
    expect(activeCard).toHaveTextContent("First Encounters with Art");
    expect(activeCard).toHaveAttribute("href", "/biography/early-years");
    expect(within(activeCard).getByAltText("Early Years")).toHaveClass(
      "object-cover"
    );
    expect(thumbnailGrid).toHaveClass("grid-cols-5");
    expect(
      within(mobileBiography).getByRole("button", {
        name: "Show Early Years biography story",
      })
    ).toHaveAttribute("aria-current", "true");
    expect(
      within(mobileBiography).getByRole("button", {
        name: "Show Early Years biography story",
      })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(mobileBiography).getByRole("link", {
        name: /Read the full story/i,
      })
    ).toHaveAttribute("href", "/biography");
    expect(
      within(mobileBiography).getAllByTestId(
        "prototype-mobile-biography-thumbnail"
      )
    ).toHaveLength(5);
    expect(
      within(mobileBiography).getAllByTestId("prototype-mobile-biography-dot")
    ).toHaveLength(5);

    fireEvent.click(
      within(mobileBiography).getByRole("button", {
        name: "Show Meeting Beryl biography story",
      })
    );

    expect(
      within(mobileBiography).getByTestId(
        "prototype-mobile-biography-featured-card"
      )
    ).toHaveTextContent("Meeting Beryl");
    expect(
      within(mobileBiography).getByTestId(
        "prototype-mobile-biography-featured-card"
      )
    ).toHaveAttribute("href", "/biography/meeting-beryl");
    expect(
      within(mobileBiography).getByRole("button", {
        name: "Show Meeting Beryl biography story",
      })
    ).toHaveAttribute("aria-current", "true");
    expect(
      within(mobileBiography).getByRole("button", {
        name: "Show Early Years biography story",
      })
    ).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(
      within(mobileBiography).getByRole("button", {
        name: "Show Ethos",
      })
    );

    expect(
      within(mobileBiography).getByTestId(
        "prototype-mobile-biography-featured-card"
      )
    ).toHaveTextContent("Ethos");
  });

  it("centers the biography timeline and read-more dividers behind their markers", () => {
    const biographySource = readRepoFile(
      "src/components/prototypes/home/BiographyPrototypeSection.tsx"
    );

    render(
      <BiographyPrototypeSection
        articles={[
          createBiographyArticle("early-years", "Early Years", "Early"),
          createBiographyArticle("meeting-beryl", "Meeting Beryl", "Beryl"),
          createBiographyArticle("ethos", "Ethos", "Ethos"),
          createBiographyArticle("later-years", "Later Years", "Later"),
          createBiographyArticle("obituary", "Obituary", "Obituary"),
        ]}
      />
    );

    expect(screen.getByTestId("prototype-biography-timeline-line")).toHaveClass(
      "top-9",
      "z-0",
      "2xl:top-11"
    );
    expect(
      screen.getByTestId("prototype-biography-read-more-divider")
    ).toHaveClass("top-1/2", "z-0");
    expect(screen.getByRole("link", { name: /Read more/i })).toHaveClass(
      "relative",
      "z-10"
    );
    expect(biographySource).toContain("absolute -top-5");
    expect(biographySource).not.toContain("-mt-px");
  });

  it("keeps the prototype biography section present when article data is unavailable", () => {
    render(<BiographyPrototypeSection articles={[]} />);

    expect(
      screen.getByTestId("prototype-biography-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("prototype-biography-empty")).toHaveTextContent(
      "Biography articles are unavailable."
    );
    expect(screen.getByRole("link", { name: /Read more/i })).toHaveAttribute(
      "href",
      "/biography"
    );
    expect(
      screen.getByRole("link", { name: /Read the full story/i })
    ).toHaveAttribute("href", "/biography");
  });

  it("renders the prototype blog section with real blog links and guide text excluded", () => {
    render(
      <BlogPrototypeSection
        blogs={[
          createBlog("lead-story", "Lead Story", "Lead blog subtitle"),
          createBlog("studio-note", "Studio Note"),
          createBlog("archive-note", "Archive Note"),
        ]}
      />
    );

    const desktopBlog = screen.getByTestId("prototype-desktop-blog");

    expect(
      within(desktopBlog).getByRole("heading", {
        level: 2,
        name: "Lead Story",
      })
    ).toBeInTheDocument();
    expect(
      within(desktopBlog).getByRole("link", { name: /Read more/i })
    ).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(
      within(desktopBlog).getByRole("link", { name: /Lead Story/i })
    ).toHaveAttribute(
      "href",
      "/blog/lead-story"
    );
    expect(
      within(desktopBlog).getByRole("link", { name: /Studio Note/i })
    ).toHaveAttribute(
      "href",
      "/blog/studio-note"
    );
    expect(
      screen.queryByText(/grandfather's story/i)
    ).not.toBeInTheDocument();
  });

  it("renders the mobile blog mockup as a journal archive backed by real posts", () => {
    render(
      <BlogPrototypeSection
        blogs={[
          createBlog(
            "lead-story",
            "Lead Story",
            "Lead blog subtitle",
            "2023-04-14T00:00:00.000Z"
          ),
          createBlog(
            "studio-note",
            "Studio Note",
            "First update for a while.",
            "2023-03-03T00:00:00.000Z"
          ),
          createBlog(
            "archive-note",
            "Archive Note",
            "Project seems to have died.",
            "2023-01-19T00:00:00.000Z"
          ),
          createBlog(
            "gallery-visit",
            "Gallery Visit",
            "A moment from the archive.",
            "2022-12-02T00:00:00.000Z"
          ),
        ]}
      />
    );

    const mobileBlog = screen.getByTestId("prototype-mobile-blog");
    const featured = within(mobileBlog).getByTestId(
      "prototype-mobile-blog-featured"
    );
    const archive = within(mobileBlog).getByTestId(
      "prototype-mobile-blog-archive"
    );

    expect(mobileBlog).toHaveTextContent("Journal");
    expect(
      within(mobileBlog).getByRole("heading", {
        level: 2,
        name: "Notes from the Studio",
      })
    ).toBeInTheDocument();
    expect(mobileBlog).toHaveTextContent(
      "Reflections, updates, and stories from the life and work of Joseph Laoutaris."
    );
    expect(featured).toHaveTextContent("Featured memorial story");
    expect(featured).toHaveTextContent("Lead Story");
    expect(featured).toHaveTextContent("Lead blog subtitle");
    expect(featured).toHaveTextContent("APR 14, 2023");
    expect(within(featured).getByAltText("Lead Story")).toHaveClass(
      "object-cover"
    );
    expect(
      within(featured).getByRole("link", { name: /Read the full story/i })
    ).toHaveAttribute("href", "/blog/lead-story");
    expect(within(archive).getAllByRole("listitem")).toHaveLength(3);
    expect(
      within(archive).getByRole("link", { name: /Studio Note/i })
    ).toHaveAttribute("href", "/blog/studio-note");
    expect(archive).toHaveTextContent("MAR 3, 2023");
    expect(archive).toHaveTextContent("JAN 19, 2023");
    expect(archive).toHaveTextContent("DEC 2, 2022");
    expect(
      within(mobileBlog).getByRole("link", {
        name: /Browse all journal entries/i,
      })
    ).toHaveAttribute("href", "/blog");
  });

  it("keeps the prototype blog section present when blog data is unavailable", () => {
    render(<BlogPrototypeSection blogs={[]} />);

    expect(screen.getByTestId("prototype-blog-section")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Latest blog posts" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read more/i })).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(
      screen.getByRole("link", { name: /Browse all journal entries/i })
    ).toHaveAttribute("href", "/blog");
    expect(screen.getByTestId("prototype-mobile-blog-empty")).toHaveTextContent(
      "Blog entries will appear here when archive posts are available."
    );
  });

  it("renders the prototype collections section as an animated accordion with real collection links", () => {
    render(
      <CollectionPrototypeSection
        collections={[
          createCollection("extra-large", "Extra Large", "art-1"),
          createCollection("portraits-of-beryl", "Portraits of Beryl", "art-2"),
          createCollection("family-favourites", "Family Favourites", null),
        ]}
      />
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Explore the collections",
      })
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: /^Explore the collections/i })
        .every((link) => link.getAttribute("href") === "/collections")
    ).toBe(true);
    const desktopCollections = screen.getByTestId(
      "prototype-desktop-collections"
    );
    expect(
      within(desktopCollections).getByRole("link", { name: /Extra Large/i })
    ).toHaveAttribute("href", "/collections/extra-large/art-1");
    expect(
      screen.getByTestId("prototype-collection-featured-card")
    ).toHaveClass("overflow-hidden");
    expect(
      screen.getAllByTestId("prototype-collection-expanded-title")[0]
    ).toHaveClass(
      "w-[var(--prototype-collection-expanded-copy-width)]",
      "translate-x-0",
      "opacity-100",
      "delay-200"
    );
    expect(
      screen.getAllByTestId("prototype-collection-collapsed-title")[0]
    ).toHaveClass("-translate-x-12", "opacity-0");

    expect(
      screen.getByRole("button", {
        name: "Expand Extra Large collection panel",
      })
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", {
        name: "Expand Portraits of Beryl collection panel",
      })
    ).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Expand Portraits of Beryl collection panel",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Expand Extra Large collection panel",
      })
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", {
        name: "Expand Portraits of Beryl collection panel",
      })
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getAllByTestId("prototype-collection-expanded-title")[1]
    ).toHaveClass("translate-x-0", "opacity-100", "delay-200");
    expect(
      screen.getAllByTestId("prototype-collection-collapsed-title")[1]
    ).toHaveClass("-translate-x-12", "opacity-0");
    expect(
      screen.getAllByTestId("prototype-collection-expanded-title")[0]
    ).toHaveClass("translate-x-16", "opacity-0");
    expect(
      screen.getByRole("link", { name: /Portraits of Beryl/i })
    ).toHaveAttribute("href", "/collections/portraits-of-beryl/art-2");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Expand Family Favourites collection panel",
      })
    );

    expect(
      screen.getByRole("link", { name: /Family Favourites/i })
    ).toHaveAttribute("href", "/collections/family-favourites");
  });

  it("renders the mobile collections mockup deck with accessible selection controls", () => {
    render(
      <CollectionPrototypeSection
        collections={[
          createCollection("extra-large", "Extra Large", "art-1"),
          createCollection("portraits-of-beryl", "Portraits of Beryl", "art-2"),
          createCollection("family-favourites", "Family Favourites", null),
          createCollection("semi-abstract", "Semi-Abstract", "art-4"),
        ]}
      />
    );

    const mobileDeck = screen.getByTestId("prototype-mobile-collections");
    const activeCard = within(mobileDeck).getByTestId(
      "prototype-mobile-collection-featured-card"
    );

    expect(activeCard).toHaveTextContent("Extra Large");
    expect(activeCard).toHaveTextContent("Extra Large subtitle");
    expect(activeCard).toHaveClass(
      "rounded-[14px]",
      "absolute",
      "left-1/2",
      "h-[430px]",
      "w-[min(74vw,330px)]",
      "-translate-x-1/2",
      "z-40",
      "transition-[opacity,transform]"
    );
    expect(
      within(mobileDeck).getAllByTestId("prototype-mobile-collection-card")[0]
    ).toHaveClass("z-20", "right-[4.5vw]", "h-[350px]");
    expect(
      within(mobileDeck).getAllByTestId("prototype-mobile-collection-card")[1]
    ).toHaveClass("z-10", "right-[-9vw]", "h-[315px]");
    expect(within(mobileDeck).getAllByText("01").length).toBeGreaterThan(0);
    expect(
      within(mobileDeck).getByRole("link", {
        name: "Open Extra Large collection",
      })
    ).toHaveAttribute("href", "/collections/extra-large/art-1");
    expect(
      within(mobileDeck).getByRole("button", {
        name: "Select Extra Large mobile collection card",
      })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(mobileDeck).getByRole("button", {
        name: "Show Extra Large",
      })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(mobileDeck).getByRole("button", {
        name: "Show Portraits of Beryl",
      })
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      within(mobileDeck).getByRole("button", {
        name: "Show previous collection",
      })
    ).toBeInTheDocument();
    expect(
      within(mobileDeck).getByRole("button", {
        name: "Show next collection",
      })
    ).toBeInTheDocument();

    fireEvent.click(
      within(mobileDeck).getByRole("button", {
        name: "Show next collection",
      })
    );

    const updatedActiveCard = within(mobileDeck).getByTestId(
      "prototype-mobile-collection-featured-card"
    );
    expect(updatedActiveCard).toHaveTextContent("Portraits of Beryl");
    expect(
      within(mobileDeck).getByRole("button", {
        name: "Show Portraits of Beryl",
      })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(mobileDeck).getByRole("link", {
        name: "Open Portraits of Beryl collection",
      })
    ).toHaveAttribute("href", "/collections/portraits-of-beryl/art-2");
    expect(mockEmblaApi.scrollNext).toHaveBeenCalled();

    fireEvent.click(
      within(mobileDeck).getByRole("button", {
        name: "Show previous collection",
      })
    );

    expect(
      within(mobileDeck).getByTestId("prototype-mobile-collection-featured-card")
    ).toHaveTextContent("Extra Large");
    expect(mockEmblaApi.scrollPrev).toHaveBeenCalled();

    fireEvent.click(
      within(mobileDeck).getByRole("button", {
        name: "Show Family Favourites",
      })
    );

    expect(
      within(mobileDeck).getByTestId("prototype-mobile-collection-featured-card")
    ).toHaveTextContent("Family Favourites");
    expect(mockEmblaApi.scrollTo).toHaveBeenCalledWith(2);

    fireEvent.keyDown(mobileDeck, { key: "ArrowRight" });

    expect(
      within(mobileDeck).getByTestId("prototype-mobile-collection-featured-card")
    ).toHaveTextContent("Semi-Abstract");
  });

  it("keeps the mobile collections carousel Embla-based with transform-only card transitions", () => {
    const sectionSource = readRepoFile(
      "src/components/prototypes/home/CollectionPrototypeSection.tsx"
    );
    const mobileDeckSource =
      sectionSource.match(
        /function MobileCollectionDeck[\s\S]*?function CollectionPrototypeEmptyState/
      )?.[0] ?? "";

    expect(mobileDeckSource).toContain("useEmblaCarousel");
    expect(mobileDeckSource).toContain("emblaApi?.scrollPrev()");
    expect(mobileDeckSource).toContain("emblaApi?.scrollNext()");
    expect(mobileDeckSource).toContain("emblaApi?.scrollTo(index)");
    expect(mobileDeckSource).toContain("sr-only");
    expect(mobileDeckSource).toContain("h-[470px]");
    expect(sectionSource).toContain("w-[min(74vw,330px)]");
    expect(sectionSource).toContain("w-[min(45vw,205px)]");
    expect(sectionSource).not.toContain("basis-[66vw]");
    expect(sectionSource).not.toContain("translate-x-[22%]");
    expect(sectionSource).not.toContain("-translate-x-[22%]");
    expect(mobileDeckSource).toContain("transition-[opacity,transform]");
    expect(mobileDeckSource).not.toContain("onTouchStart");
    expect(mobileDeckSource).not.toContain("onTouchEnd");
    expect(mobileDeckSource).not.toContain("touchStart");
    expect(mobileDeckSource).not.toContain("transition-[opacity,transform,width,height]");
    const mobileTransitions =
      mobileDeckSource.match(/transition-\[[^\]]+\]/g) ?? [];
    expect(mobileTransitions).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /width|height|top|left|right|bottom|margin|flex|min-height|max-height/
        ),
      ])
    );
  });

  it("keeps the prototype collections section present when collection data is unavailable", () => {
    render(<CollectionPrototypeSection collections={[]} />);

    expect(
      screen.getByTestId("prototype-collections-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("prototype-collections-empty")).toHaveTextContent(
      "Collection rooms are unavailable."
    );
    expect(
      screen
        .getAllByRole("link", { name: /^Explore the collections/i })
        .every((link) => link.getAttribute("href") === "/collections")
    ).toBe(true);
  });

  it("lets the fixed bottom shop dropdown resize the shop rail", () => {
    render(
      <HomePrototype
        shopProducts={[
          createProduct("yellow-composition", "Yellow Composition"),
          createProduct("orange-form", "Orange Form"),
        ]}
      />
    );

    const productRail = screen.getByTestId("prototype-shop-product-rail");

    expect(
      screen.queryByTestId("prototype-shop-product-size-controls")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("prototype-shop-size-rail")
    ).not.toBeInTheDocument();
    expect(productRail).toHaveAttribute("data-size-preset", "feature");

    fireEvent.change(screen.getByRole("combobox", { name: "Shop items" }), {
      target: { value: "larger" },
    });
    expect(productRail).toHaveAttribute("data-size-preset", "larger");

    fireEvent.change(screen.getByRole("combobox", { name: "Shop items" }), {
      target: { value: "large" },
    });
    expect(productRail).toHaveAttribute("data-size-preset", "large");
  });

  it("renders the prototype shop section with product links and enquiry-safe copy", () => {
    render(
      <ShopPrototypeSection
        products={[
          createProduct("yellow-composition", "Yellow Composition"),
          createProduct("orange-form", "Orange Form", {
            productType: "print",
            price: "6500.00",
            image: null,
          }),
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Available now" })
    ).toBeInTheDocument();
    const desktopRail = screen.getByTestId("prototype-shop-product-rail");

    expect(desktopRail).toHaveAttribute(
      "data-size-preset",
      "large"
    );
    expect(
      screen.getByRole("link", { name: /View full shop/i })
    ).toHaveAttribute("href", "/shop/products");
    expect(
      within(desktopRail).getByRole("link", { name: /Yellow Composition/i })
    ).toHaveAttribute("href", "/shop/products/yellow-composition");
    expect(within(desktopRail).getByText("€18,000")).toBeInTheDocument();
    expect(within(desktopRail).getByText("Image pending")).toBeInTheDocument();
    expect(
      screen.queryByText(/cart|checkout|shipping|refund|payment/i)
    ).not.toBeInTheDocument();
  });

  it("renders the mobile shop mockup with category pills and accessible product controls", () => {
    render(
      <ShopPrototypeSection
        products={[
          createProduct("yellow-composition", "Yellow Composition"),
          createProduct("orange-form", "Orange Form", {
            productType: "print",
            price: "6500.00",
          }),
          createProduct("blue-study", "Blue Study", {
            productType: "",
            tags: [],
            price: "1200.00",
          }),
        ]}
      />
    );

    const mobileShop = screen.getByTestId("prototype-mobile-shop");
    const featuredCard = within(mobileShop).getByTestId(
      "prototype-mobile-shop-featured-card"
    );

    for (const category of [
      "Featured",
      "Originals",
      "Prints",
      "Books",
      "Editions",
    ]) {
      expect(mobileShop).toHaveTextContent(category);
    }
    expect(featuredCard).toHaveAttribute(
      "href",
      "/shop/products/yellow-composition"
    );
    expect(featuredCard).toHaveTextContent("Yellow Composition");
    expect(featuredCard).toHaveTextContent("original");
    expect(featuredCard).toHaveTextContent("€18,000");
    expect(
      within(mobileShop).getAllByTestId("prototype-mobile-shop-peek-card")
    ).toHaveLength(2);
    expect(
      within(mobileShop).getByRole("button", {
        name: "Show previous shop product",
      })
    ).toBeEnabled();
    expect(
      within(mobileShop).getByRole("button", {
        name: "Show next shop product",
      })
    ).toBeEnabled();
    expect(
      within(mobileShop).getByTestId("prototype-mobile-shop-progress")
    ).toHaveTextContent("Swipe to browse");

    fireEvent.click(
      within(mobileShop).getByRole("button", {
        name: "Show next shop product",
      })
    );

    const updatedFeaturedCard = within(mobileShop).getByTestId(
      "prototype-mobile-shop-featured-card"
    );
    expect(updatedFeaturedCard).toHaveAttribute(
      "href",
      "/shop/products/orange-form"
    );
    expect(updatedFeaturedCard).toHaveTextContent("Orange Form");
    expect(updatedFeaturedCard).toHaveTextContent("print");

    fireEvent.keyDown(
      within(mobileShop).getByTestId("prototype-mobile-shop-carousel"),
      { key: "ArrowRight" }
    );

    expect(
      within(mobileShop).getByTestId("prototype-mobile-shop-featured-card")
    ).toHaveTextContent("Blue Study");
    expect(
      within(mobileShop).getByTestId("prototype-mobile-shop-featured-card")
    ).toHaveTextContent("Archive product");
  });

  it("keeps the prototype shop section present when products are unavailable", () => {
    render(<ShopPrototypeSection products={[]} hasLoadError />);

    expect(screen.getByTestId("prototype-shop-section")).toBeInTheDocument();
    expect(screen.getByTestId("prototype-shop-empty-state")).toHaveTextContent(
      "Shop preview unavailable"
    );
    expect(
      screen.getByRole("link", { name: /View shop page/i })
    ).toHaveAttribute("href", "/shop/products");
  });

  it("keeps prototype files out of the live homepage layout path", () => {
    const combinedSource = [
      "src/app/prototype/home/page.tsx",
      "src/components/prototypes/home/HomePrototype.tsx",
      "src/components/prototypes/home/BiographyPrototypeSection.tsx",
      "src/components/prototypes/home/BiographyPrototypeLoader.tsx",
      "src/components/prototypes/home/BlogPrototypeSection.tsx",
      "src/components/prototypes/home/BlogPrototypeLoader.tsx",
      "src/components/prototypes/home/CollectionPrototypeSection.tsx",
      "src/components/prototypes/home/CollectionPrototypeLoader.tsx",
      "src/components/prototypes/home/ShopPrototypeSection.tsx",
      "src/components/prototypes/home/ShopPrototypeLoader.tsx",
      "src/components/prototypes/home/PrototypeSectionPlaceholder.tsx",
      "src/components/prototypes/home/prototypeHomeLayout.ts",
    ]
      .map(readRepoFile)
      .join("\n");

    expect(combinedSource).not.toContain("@/components/views/Home");
    expect(combinedSource).not.toContain("ContentLayout");
    expect(combinedSource).not.toContain("CollectionSectionLoader");
    expect(combinedSource).not.toContain("CollectionSection");
    expect(combinedSource).not.toContain("src/app/page.tsx");
  });
});
