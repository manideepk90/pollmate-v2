import CommonButton from "@/app/components/buttons/CommonButton";
import Link from "next/link";
import React from "react";
import CustomChart from "@/app/components/Chart/CustomChart";
import DashboardPollItemWithBlock from "@/app/components/dashboard/DashboardPollItemWithBlock";

function page() {
  return (
    <section className="w-full h-full flex flex-col justify-center gap-4">
      <h1 className="text-primary text-3xl font-bold">Polls</h1>
      <CustomChart data={[]} />
      <h3 className="text-primary text-2xl font-bold">list</h3>
      <div className="w-full h-full flex gap-4 flex-col">
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />

        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
      </div>
      <div className="w-full h-full flex justify-center">
        <Link href={"/dashboard/polls"}>
          <CommonButton
            style={{ padding: "10px 26px", borderRadius: "10px" }}
            className="text-primary"
          >
            view more
          </CommonButton>
        </Link>
      </div>
    </section>
  );
}
export default page;
