import React from "react";
import PollItem from "../polls/poll-item";
import "./poll-list.css";
function PollList({ isStraight = false }: { isStraight?: boolean }) {
  return (
    <div
      className="poll-list grid w-full gap-10 justify-items-center items-center"
      data-isstraight={isStraight}
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
