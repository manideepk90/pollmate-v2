import React from "react";
import CustomChart from "../Chart/CustomChart";
import PollList from "../pages/poll-list";
import PollListItem from "../pages/poll-list2";

function MyPollsPage() {
  return (
    <div className="flex flex-col gap-10 items-center py-10 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary">My Polls</h3>
      </div>
      <CustomChart />
      <div className="w-full flex flex-col gap-5">
        <PollListItem />
        <PollListItem />
        <PollListItem />
        <PollListItem />
        <PollListItem />
      </div>
    </div>
  );
}

export default MyPollsPage;
