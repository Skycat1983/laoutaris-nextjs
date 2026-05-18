import { Suspense } from "react";
import type { Metadata } from "next";
import { BlogDetailLoader } from "@/components/loaders/viewLoaders/BlogDetailLoader";
import { BlogPostJsonLd } from "@/components/metadata/PublicDetailJsonLd";
import { BlogDetailSkeleton } from "@/components/views/BlogDetail";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import {
  buildBlogDetailMetadata,
  buildMissingPublicDetailMetadata,
  buildUnavailablePublicDetailMetadata,
} from "@/lib/metadata/publicDetailMetadata";

type BlogSlugPageProps = {
  params: { slug: string };
  searchParams: { comments?: string };
};

export async function generateMetadata({
  params,
}: BlogSlugPageProps): Promise<Metadata> {
  try {
    const blog = await getBlogBySlugWithAuthor(params.slug);

    if (!blog) {
      return buildMissingPublicDetailMetadata("Blog post");
    }

    return buildBlogDetailMetadata(blog);
  } catch {
    return buildUnavailablePublicDetailMetadata("Blog post");
  }
}

export default async function BlogSlug({
  params,
  searchParams,
}: BlogSlugPageProps) {
  const showComments = searchParams.comments === "true";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 py-4 container mx-auto">
      <Suspense fallback={null}>
        <BlogPostJsonLd slug={params.slug} />
      </Suspense>
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetailLoader slug={params.slug} showComments={showComments} />
      </Suspense>
    </main>
  );
}
