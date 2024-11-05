import Image from "next/image";
import React from "react";
import PollItem from "./poll-item";
import PollOptionItem from "./poll-option-item";
import CommonButton from "../buttons/CommonButton";

function PollPage({
  poll = {
    title: "Fav movie max-60 characters",
    description: "movie description for the app max-350 characters",
    createdAt: new Date(),
    updatedAt: new Date(),
    options: [
      {
        value: "test",
        votes: 60,
      },
      {
        value: "test2",
        votes: 10,
      },
    ],
  },
}: {
  poll?: Poll | null;
}) {
  return (
    <div
      style={{
        minWidth: "200px",
      }}
      className="flex-1 flex flex-col gap-5 items-center p-6"
    >
      <div className="flex items-center justify-center w-full gap-5">
        <h2 className="text-3xl text-center font-bold text-primary">
          {poll?.title}
        </h2>
      </div>

      <p className="text-md text-slate-500 text-center">{poll?.description}</p>
      <div className="flex items-center justify-center w-full gap-5 p-2">
        <Image
          src={"/assets/icons/share.svg"}
          alt="poll"
          width={24}
          height={24}
        />
        <Image
          src={"/assets/icons/report.svg"}
          alt="poll"
          width={24}
          height={24}
        />
      </div>
      <div className="flex items-center justify-center w-full h-56 gap-5 relative border overflow-hidden border-slate-500 rounded-xl">
        <Image
          src={"/assets/dummy-placeholder.png"}
          alt="poll"
          title="poll"
          fill
          style={{
            objectFit: "contain",
            top: 0,
            left: 0,
          }}
        />
      </div>
      <div className="flex items-center justify-center w-full gap-5">
        {poll?.updatedAt ? (
          <p className="text-sm text-slate-500">
            Updated at {poll?.updatedAt.toLocaleString()}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Created at {poll?.createdAt.toLocaleString()}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-5">
        {poll?.options.map((option, index) => (
          <PollOptionItem
            key={index}
            option={option}
            active={option.value === "test"}
          />
        ))}
      </div>
      <div className="flex items-center justify-center w-full gap-5">
        <h6 className="text-primary text-xl font-bold">Total votes</h6>
        <p className="text-primary text-xl font-bold">
          {poll?.options.reduce((acc, curr) => acc + curr.votes, 0)}
        </p>
      </div>
      <div className="flex items-center justify-center w-full gap-5">
        <CommonButton>Refer people</CommonButton>
      </div>
    </div>
  );
}

export default PollPage;
