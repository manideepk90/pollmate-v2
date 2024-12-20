import React from "react";

function PollOption({
  loading = false,
  active = false,
  option = {
    value: "option",
    votes: 0,
  },
  callback,
}: {
  loading?: boolean;
  active?: boolean;
  option?: {
    value?: string;
    votes?: number;
  };
  callback: (value: string) => void;
}) {
  const handleClick = () => {
    callback(option?.value || "");
  };
  return (
    <div
      className={`w-full min-h-4 rounded-full border-2 p-1 cursor-pointer select-none
    flex flex-col items-center justify-center  gap-1 
    ${active ? "bg-primary border-white" : "bg-white border-primary"}
    ${loading ? "opacity-50 cursor-not-allowed" : ""}
    `}
      onClick={!loading ? handleClick : undefined}
    >
      <p className={`text-xl ${active ? "text-white" : "text-primary"}`}>
        {option?.value}
      </p>
      <p className={`text-sm ${active ? "text-white" : "text-slate-500"}`}>
        {option?.votes} votes
      </p>
    </div>
  );
}

export default PollOption;
