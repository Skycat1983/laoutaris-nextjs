import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import ArtworkSection from "@/components/homepageSections/ArtworkSection";
import BiographySection from "@/components/homepageSections/BiographySection";
import ProjectSection from "@/components/homepageSections/ProjectSection";
import Hero from "@/components/ui/hero/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-full flex-col items-center justify-start">
      <Hero />
      <div className="flex flex-col items-center justify-center gap-[1px] py-[100px] container">
        <div className="">
          <ArtworkSection />
        </div>
        <HorizontalDivider />
        {/* <div className="p-4">
          <ProjectSection />
        </div> */}
        <div className="p-4">
          <BiographySection />
        </div>
      </div>
    </main>
  );
}
