import CommonButton from "@/app/components/buttons/CommonButton";
import CustomChart from "@/app/components/Chart/CustomChart";
import PollDashboard from "@/app/components/polls/PollDashboard";
import React from "react";

function page() {
  return <PollDashboard poll={poll} />;
}

export default page;
  