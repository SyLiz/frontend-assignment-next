import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:border-gray-300 hover:bg-gray-100 transition",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
