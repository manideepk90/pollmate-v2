import AdComponent from "@/app/components/Ads/AdComponent";
import PollList from "@/app/components/pages/poll-list";
import PollPage from "@/app/components/polls/PollPage";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col gap-10 mb-20">
      <div className="min-w-full min-h-full flex gap-5 md:flex-row flex-col md:p-5 p-2 ">
        <AdComponent />

        <PollPage />
        <AdComponent />
      </div>
      <div className="flex flex-col gap-10 justify-center items-center">
        <h6 className="text-primary text-2xl font-bold">Discover more polls</h6>
        <PollList />
      </div>
    </div>
  );
}

export default Page;
