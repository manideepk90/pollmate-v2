import Image from "next/image";
import React from "react";

function CardItem({
  icon,
  title,
  value,
  linear = "2",
}: {
  icon: string;
  title: string;
  value: string;
  linear: string;
}) {
  return (
    <div
      style={{
        background: linear === "2" ? "var(--linear-2)" : "var(--linear-3)",
        borderRadius: "16px",
      }}
      className="max-w-[468px] min-w-[250px] flex flex-1 min-h-24"
    >
      <div className="w-full h-full flex items-center p-4">
        <Image src={icon} alt="dashboard" width={80} height={80} />
      </div>
      <div className="w-full h-full flex flex-col gap-1 items-center justify-center">
        <h2 className="text-white text-2xl font-bold">{value}</h2>
        <h2 className="text-white text-2xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

export default CardItem;
