import React from "react";

function PollItem({
  poll = {
    title: "Fav Movie",
    description: "What is your favorite movie?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}: {
  poll?: Poll;
}) {
  return (
    <div
      style={{
        background: "var(--linear)",
        width: "323px",
        height: "62px",
        borderRadius: "31px",
      }}
      className="flex flex-col relative 
        px-16 py-3"
    >
      <div
        style={{
          width: "317px",
          height: "56px",
          borderRadius: "31px",
          top: "3px",
          left: "3px",
        }}
        className="absolute bg-white grid place-items-center"
      >
        <h3 className="text-primary text-2xl">{poll?.title}</h3>
      </div>
    </div>
  );
}

export default PollItem;
