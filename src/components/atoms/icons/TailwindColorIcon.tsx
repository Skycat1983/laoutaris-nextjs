interface ColorProps {
  color: string;
}

const TailwindColorIcon = ({ color }: ColorProps) => {
  const colorMap: { [key: string]: string } = {
    red: "#ff0000",
    blue: "#0000ff",
    green: "#00ff00",
    yellow: "#ffff00",
    orange: "#ffa500",
    purple: "#800080",
    black: "#000000",
    white: "#ffffff",
    grey: "#808080",
    pink: "#ffc0cb",
    teal: "#008080",
    brown: "#a52a2a",
    gray: "#808080",
    lightblue: "#add8e6",
    lime: "#00ff00",
    olive: "#808000",
  };
  const colorHex = colorMap[color];

  if (!colorHex) {
    console.warn(`Unaccounted for color found: ${color}`);
    return;
  }

  return (
    <div
      className="rounded-full h-8 w-8"
      style={{ backgroundColor: colorHex }}
    ></div>
  );
};

export default TailwindColorIcon;
