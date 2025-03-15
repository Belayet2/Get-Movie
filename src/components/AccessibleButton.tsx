import React from "react";

interface AccessibleButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  onClick,
  className = "",
  ariaLabel,
  children,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default AccessibleButton;
