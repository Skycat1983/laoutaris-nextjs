import { ColourInfo } from "@/lib/data/types";

const HexColorIcon = ({ hexColor }: { hexColor: ColourInfo }) => {
  return (
    <div
      style={{
        backgroundColor: hexColor.color,
        borderRadius: "9999px",
        height: "30px",
        width: "30px",
      }}
    ></div>
  );
};

export { HexColorIcon };
