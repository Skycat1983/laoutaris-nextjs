import { IFrontendArtwork } from "@/lib/types/artworkTypes";

type PageItemProps = {
  isActive: boolean;
  onClick: () => void;
  item: IFrontendArtwork;
};

const PaginationCard = ({ isActive, onClick, item }: PageItemProps) => {
  const baseClass =
    "h-[300px] w-auto overflow-hidden transition-all ease-out duration-300 transform cursor-pointer";
  const activeClass = "scale-1 opacity-100 shadow-xl";
  const inactiveClass = "scale-90 opacity-70";

  return (
    <div
      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
      onClick={onClick}
    >
      <img
        className={`object-cover w-full h-full transition-transform duration-1000 ease-in-out hover:scale-110`}
        src={item.image.secure_url}
        alt={item.title}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
};

export default PaginationCard;
