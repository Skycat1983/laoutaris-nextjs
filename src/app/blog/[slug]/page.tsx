import { BlogDetailLoader } from "@/components/loaders/BlogDetailLoader";

export default async function BlogSlug({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container mx-auto">
      <BlogDetailLoader slug={params.slug} />
    </main>
  );
}
