"use client";
import React from "react";
import clsx from "clsx";
function CommonButton({
  children,
  callback = () => {},
  className = "rounded-md  px-4 py-1",
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
      className={clsx(
        `${disabled ? "bg-gray-400" : "bg-primary"} ${
          variant === "outline"
            ? "bg-transparent border border-primary text-primary"
            : "text-white"
        } `,
        className
      )}
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
