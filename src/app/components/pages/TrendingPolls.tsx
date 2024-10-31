import React from "react";
import PollList2 from "./poll-list2";
import DashboardPollItem from "../dashboard/DashboardPollItem";
import CommonButton from "../buttons/CommonButton";

function TrendingPolls() {
  return (
    <section className="w-full h-full flex flex-col justify-center gap-4">
      <h1 className="text-primary text-3xl font-bold">Trending Polls</h1>
      <div className="w-full h-full flex gap-4 flex-wrap">
        <DashboardPollItem />
        <DashboardPollItem />
        <DashboardPollItem />
        <DashboardPollItem />
        <DashboardPollItem />
        <DashboardPollItem />
        <DashboardPollItem />
        <DashboardPollItem />
      </div>
      <div className="w-full h-full flex justify-center">
        <CommonButton
          style={{ padding: "10px 26px", borderRadius: "10px" }}
          className="text-primary"
        >
          Explore polls
        </CommonButton>
      </div>
    </section>
  );
}

export default TrendingPolls;
