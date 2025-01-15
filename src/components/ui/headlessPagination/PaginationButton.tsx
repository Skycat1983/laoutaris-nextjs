import React from "react";

type NavigationButtonProps = {
  label: string | React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  googleIcon?: React.ReactNode;
};

const NavigationButton = ({
  label,
  onClick,
  disabled = false,
  googleIcon,
}: NavigationButtonProps) => (
  <>
    {googleIcon ? (
      <span
        className="material-symbols-outlined mx-10 cursor-pointer text-gray-400"
        onClick={onClick}
      >
        {googleIcon}
      </span>
    ) : (
      <button
        disabled={disabled}
        className="page-item m-3 p-3 "
        onClick={onClick}
      >
        {label}
      </button>
    )}
  </>
);

export default NavigationButton;
