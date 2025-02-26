import React from "react";
import Image from "next/image";

const NewLogoLight = () => {
  const logo1 =
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1740560387/logos/2_vbw8o7.png";

  const size = 400;

  const className = `w-[${size}px] h-[${size}px]`;

  return (
    <div className="h-[300px] w-full overflow-hidden relative items-center justify-center flex z-10">
      <Image
        src={logo1}
        alt="logo"
        width={200}
        height={200}
        className={`object-cover scale-150 ${className}`}
      />
    </div>
  );
};

const NewLogoDark = () => {
  const logo1 =
    "https://res.cloudinary.com/dzncmfirr/image/upload/v1740560387/logos/1_nls1uo.png";

  const size = 400;

  const className = `w-[${size}px] h-[${size}px]`;

  return (
    <div className="h-[300px] w-full overflow-hidden relative items-center justify-center flex z-10">
      <Image
        src={logo1}
        alt="logo"
        width={200}
        height={200}
        className={`object-cover scale-150 ${className}`}
      />
    </div>
  );
};

export { NewLogoLight, NewLogoDark };
