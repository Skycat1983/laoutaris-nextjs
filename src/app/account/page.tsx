// import HorizontalDivider from "@/components/atoms/HorizontalDivider";
// import ArtworkSection from "@/components/sections/ArtworkSection";
// import BiographySection from "@/components/sections/BiographySection";
// import ProjectSection from "@/components/sections/ProjectSection";
// import Hero from "@/components/ui/hero/Hero";

import { redirect } from "next/navigation";

export default function Account() {
  redirect("http://localhost:3000/account/favourites");

  return (
    <main className="flex min-h-screen max-w-full flex-col items-center justify-start"></main>
  );
}
