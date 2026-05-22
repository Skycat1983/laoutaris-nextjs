import { PublicDetailNotFound } from "@/components/views/PublicDetailNotFound";

export default function ArtworkNotFound() {
  return (
    <PublicDetailNotFound
      title="Artwork not found"
      message="The artwork you are looking for is not available in the public archive."
      returnHref="/artwork"
      returnLabel="Browse artwork"
    />
  );
}
