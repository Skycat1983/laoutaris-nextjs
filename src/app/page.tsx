import ArtworkSection from "@/components/sections/ArtworkSection";
import BiographySection from "@/components/sections/BiographySection";
import ProjectSection from "@/components/sections/ProjectSection";
import Hero from "@/components/ui/hero/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-screen flex-col items-center justify-start">
      <Hero />
      <div className="flex flex-col items-center  justify-center gap-[1px] py-[100px] container">
        <ArtworkSection />
        <ProjectSection />
        <BiographySection />
      </div>
    </main>
  );
}
