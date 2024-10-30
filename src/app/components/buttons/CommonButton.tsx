import React from "react";

function CommonButton({
  children,
  callback = () => {},
  className = "",
}: {
  children: React.ReactNode;
  callback?: () => void;
  paddingX?: string;
  paddingY?: string;
  borderRadius?: string;
  color?: string;
  backgroundColor?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`bg-primary text-white rounded-md px-4 py-1 ${className}`}
      onClick={callback}
    >
      {children}
    </button>
  );
}

export default CommonButton;
