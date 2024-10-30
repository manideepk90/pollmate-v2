import React from "react";
import PollList from "../components/pages/poll-list";

function Page() {
  return (
    <div className="p-10 flex flex-col justify-center items-center gap-6">
      <h1 className="text-4xl  text-primary">Discover Polls</h1>
      <PollList />
    </div>
  );
}

export default Page;
