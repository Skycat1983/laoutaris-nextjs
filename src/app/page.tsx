import Hero from "@/components/ui/hero/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-screen flex-col items-center justify-start">
      <div className="mt-[100px] sm:mt-[180px] md:mt-[230px] lg:mt-[150px] h-[5px] w-full bg-blue-100 container"></div>
      <Hero />
    </main>
  );
}
