import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import ArtworkSection from "@/components/homepageSections/ArtworkSection";
import BiographySection from "@/components/homepageSections/BiographySection";
import ProjectSection from "@/components/homepageSections/ProjectSection";
import Hero from "@/components/ui/hero/Hero";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { fetchArticles } from "@/lib/server/article/data-fetching/fetchArticles";

type BiographyFields = Pick<
  IFrontendArticle,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

export default async function Home() {
  const biographyEntriesResponse = await fetchArticles<BiographyFields>(
    "section",
    "biography",
    ["title", "slug", "imageUrl"]
  );

  return (
    <main className="flex min-h-screen max-w-full flex-col items-center justify-start">
      <Hero />
      <div className="flex flex-col items-center justify-center gap-[1px] py-[100px] container">
        <div className="">
          <ArtworkSection />
        </div>

        <HorizontalDivider />

        <div className="p-4 w-full">
          <ProjectSection />
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          {biographyEntriesResponse.success ? (
            <BiographySection
              biographyEntries={biographyEntriesResponse.data}
            />
          ) : (
            <p>Error: {biographyEntriesResponse.message}</p>
          )}
        </div>
      </div>
    </main>
  );
}
