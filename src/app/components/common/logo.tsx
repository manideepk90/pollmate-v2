import React from "react";

function Logo({
  size = "md",
}: {
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
}) {
  return (
    <p className={`text-${size}`}>
      <span className="text-primary">Poll</span>
      <span className="text-secondary">Mate</span>
    </p>
  );
}

export default Logo;
