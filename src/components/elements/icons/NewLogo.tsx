import React from "react";
import Image from "next/image";

const NewLogo = () => {
  const logo1 =
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1740560387/logos/1_nls1uo.png";

  return (
    <div className="h-[200px] w-[200px] overflow-hidden relative">
      <Image
        src={logo1}
        alt="logo"
        width={200}
        height={200}
        className="object-cover scale-150"
      />
    </div>
  );
};

export default NewLogo;
