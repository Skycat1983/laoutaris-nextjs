import { PublicDetailNotFound } from "@/components/views/PublicDetailNotFound";

export default function CollectionSlugNotFound() {
  return (
    <PublicDetailNotFound
      title="Collection not found"
      message="The requested collection is not available in the archive."
      returnHref="/collections"
      returnLabel="Browse collections"
    />
  );
}
