import { SubscribeSection } from "@/components/sections";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col flex-grow">
      {children}
      <div className="container mx-auto py-16">
        <SubscribeSection isLoggedIn={false} />
      </div>
    </section>
  );
}
