import { HexColor } from "@/components/modules/disclosures/ColorPallette";

const HexColorIcon = ({ hexColor }: { hexColor: HexColor }) => {
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

export default HexColorIcon;
