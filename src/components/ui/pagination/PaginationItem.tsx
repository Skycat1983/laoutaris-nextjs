import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";

export interface PaginationArtworkLink {
  secure_url: string;
  height: number;
  width: number;
  link_to: string;
}

const PaginationItem = ({ artworkLink }: PaginationArtworkLink) => {
  const segment = useSelectedLayoutSegment();
  const isActive = segment === artworkLink._id;
  // console.warn(segment);
  return (
    <div className="h-[200px] lg:h-[400px]">
      <Image
        src={artworkLink.image.secure_url}
        alt="Untitled artwork"
        height={artworkLink.image.pixelHeight}
        width={artworkLink.image.pixelWidth}
        className="max-h-full w-auto max-w-[90vw] object-contain self-start"
      />
    </div>
  );
};

export default PaginationItem;
