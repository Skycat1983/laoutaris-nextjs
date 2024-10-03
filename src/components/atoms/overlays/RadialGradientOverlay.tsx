import { CSSProperties } from "react";

const RadialGradientOverlay = () => {
  const style: CSSProperties = {
    backgroundImage: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.30) 100%)`,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
  };

  return <div style={style}></div>;
};

export default RadialGradientOverlay;
