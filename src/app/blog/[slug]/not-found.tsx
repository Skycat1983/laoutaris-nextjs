import { PublicDetailNotFound } from "@/components/views/PublicDetailNotFound";

export default function BlogPostNotFound() {
  return (
    <PublicDetailNotFound
      title="Blog post not found"
      message="The blog post you are looking for is not available."
      returnHref="/blog"
      returnLabel="Browse blog"
    />
  );
}
