import React from "react";
import Image from "next/image";

const NewLogoLight = () => {
  const logo1 =
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,w_180,h_180/v1740560387/logos/4_yywyu6.png";

  const size = 400;

  const className = `w-[${size}px] h-[${size}px]`;

  return (
    <div className="h-[200px] w-[200px] overflow-hidden relative items-center justify-center flex z-10 bg-black p-6">
      <Image
        src={logo1}
        alt="logo"
        width={200}
        height={200}
        className={`object-contain ${className}`}
      />
    </div>
  );
};

const NewLogoDark = () => {
  const logo1 =
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,w_170,h_170/v1740560387/logos/3_ovgvau.png";
  const size = 400;

  const className = `w-[${size}px] h-[${size}px]`;

  return (
    <div className="h-[200px] w-[200px] overflow-hidden relative items-center justify-center flex z-10">
      <Image
        src={logo1}
        alt="logo"
        width={200}
        height={200}
        className={`object-contain ${className}`}
      />
    </div>
  );
};

const NewLogoLight2 = () => {
  const logo1 =
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,w_170,h_170/v1740560387/logos/2_vbw8o7.png";

  const size = 400;

  const className = `w-[${size}px] h-[${size}px]`;

  return (
    <div className="h-[250px] w-[250px] overflow-hidden relative items-center justify-center flex z-10 p-6">
      <Image
        src={logo1}
        alt="logo"
        width={200}
        height={200}
        className={`object-contain ${className}`}
      />
    </div>
  );
};

const NewLogoDark2 = () => {
  const logo1 =
    "https://res.cloudinary.com/dzncmfirr/image/upload/c_crop,w_170,h_170/v1740560387/logos/1_nls1uo.png";

  const size = 250;

  const className = `w-[${size}px] h-[${size}px]`;

  return (
    <div className="h-[200px] w-[200px] overflow-hidden relative items-center justify-center flex z-10">
      <Image
        src={logo1}
        alt="logo"
        width={200}
        height={200}
        className={`object-contain ${className}`}
      />
    </div>
  );
};

export { NewLogoLight, NewLogoDark, NewLogoLight2, NewLogoDark2 };
