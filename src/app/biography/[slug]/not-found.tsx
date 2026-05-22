import { PublicDetailNotFound } from "@/components/views/PublicDetailNotFound";

export default function BiographyArticleNotFound() {
  return (
    <PublicDetailNotFound
      title="Article not found"
      message="The biography article you are looking for is not available in the public archive."
      returnHref="/biography"
      returnLabel="Browse biography"
    />
  );
}
