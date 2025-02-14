import { CSSProperties } from "react";

const RadialGradientOverlay = () => {
  // Define the gradient with an ellipse at the center
  const style: CSSProperties = {
    // backgroundImage uses an ellipse radial gradient
    // change '%' to adjust where gradient starts changing
    // change 'rgba(0, 0, 0, 0.75)' to adjust the final color and its opacity
    backgroundImage: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.30) 100%)`,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
  };

  return <div style={style}></div>;
};

const DimmedOverlay = () => {
  return (
    <div className="col-start-1 col-end-13 row-start-1 row-end-13 lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:row-end-13 bg-black bg-opacity-30"></div>
  );
};

export { RadialGradientOverlay, DimmedOverlay };
