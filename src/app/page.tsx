import { Home } from "@/components/views/Home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main>
      <h1 className="sr-only">Joseph Laoutaris Art Archive</h1>
      <Home />
    </main>
  );
}
