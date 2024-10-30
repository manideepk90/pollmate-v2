import React from "react";
import PollItem from "../polls/poll-item";
import "./poll-list.css";
function PollList() {
  return (
    <div
      className="poll-list grid w-full gap-10 justify-items-center items-center"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(323px, 1fr))" }}
    >
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
      <PollItem />
    </div>
  );
}

export default PollList;
