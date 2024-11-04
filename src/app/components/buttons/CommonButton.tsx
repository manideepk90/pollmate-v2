"use client";
import React from "react";
import clsx from "clsx";
import { LoaderIcon } from "react-hot-toast";
function CommonButton({
  children,
  callback = () => {},
  className = "rounded-md px-4 py-1",
  disabled = false,
  title = "",
  variant = "primary",
  style,
  loading = false,
}: {
  children: React.ReactNode;
  callback?: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
  variant?: "primary" | "outline";
  style?: React.CSSProperties;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "select-none cursor-pointer hover:opacity-90 transition-opacity",
        "duration-300 ease-in-out active:bg-violet-950 ",
        `${disabled ? "bg-gray-400" : "bg-primary"} ${
          variant === "outline"
            ? "bg-transparent border border-primary text-primary active:text-white"
            : "text-white"
        } `,
        className
      )}
      onClick={callback}
      disabled={disabled || loading}
      title={title}
      style={style}
    >
      {loading ? (
        <div className="flex items-center justify-center w-full h-full px-4 py-1">
          <LoaderIcon className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default CommonButton;
