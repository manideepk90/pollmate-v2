"use client";
import Link from "next/link";
import React from "react";
function PollItem({
  poll = {
    title: "Fav Movie",
    description: "What is your favorite movie?",
    createdAt: new Date(),
    updatedAt: new Date(),
    options: [],
    publicLink: "123",
  },
}: {
  poll?: Poll;
}) {
  return (
    <Link href={`/polls/${poll?.publicLink || ""}`}>
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
          <h3 className="text-primary text-2xl">{poll?.title}</h3>
        </div>
      </div>
    </Link>
  );
}

export default PollItem;
