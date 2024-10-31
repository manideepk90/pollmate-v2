"use client";
import React from "react";

function CommonButton({
  children,
  callback = () => {},
  className = "",
  disabled = false,
  title = "",
  variant = "primary",
  style,
}: {
  children: React.ReactNode;
  callback?: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
  variant?: "primary" | "outline";
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`${disabled ? "bg-gray-400" : "bg-primary"} ${
        variant === "outline"
          ? "bg-transparent border border-primary text-primary"
          : "text-white"
      }  rounded-md px-4 py-1 ${className}`}
      onClick={callback}
      disabled={disabled}
      title={title}
      style={style}
    >
      {children}
    </button>
  );
}

export default CommonButton;
