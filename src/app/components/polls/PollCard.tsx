"use client";
import Link from "next/link";
import React from "react";

function PollCard({ poll }: { poll?: Poll }) {
  return (
    <Link href={`/polls/${poll?.public_link || ""}`}>
      <div
        style={{
          background: "var(--linear)",
          width: "250px",
          height: "55px",
          borderRadius: "31px",
        }}
        className="flex flex-col relative 
        px-16 py-3"
      >
        <div
          style={{
            width: "244px",
            height: "49px",
            borderRadius: "31px",
            top: "3px",
            left: "3px",
          }}
          className="absolute bg-white grid place-items-center"
        >
          <h3 className="text-primary text-2xl">{poll?.title.slice(0, 20)}</h3>
        </div>
      </div>
    </Link>
  );
}

export default PollCard;
