import { PublicDetailNotFound } from "@/components/views/PublicDetailNotFound";

export default function CollectionArtworkNotFound() {
  return (
    <PublicDetailNotFound
      title="Collection artwork not found"
      message="The requested artwork is not available in this collection."
      returnHref="/collections"
      returnLabel="Browse collections"
    />
  );
}
