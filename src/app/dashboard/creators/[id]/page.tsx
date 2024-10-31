import CommonButton from "@/app/components/buttons/CommonButton";
import Link from "next/link";
import CustomChart from "@/app/components/Chart/CustomChart";
import React from "react";
import CreatorsListItem from "../creatorsListItem";
import DashboardPollItem from "@/app/components/dashboard/DashboardPollItem";
import DashboardPollItemWithBlock from "@/app/components/dashboard/DashboardPollItemWithBlock";
import DashboardUserReport from "@/app/components/dashboard/dashboardUserReport";

function page() {
  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-10">
      <h1 className="text-primary text-3xl font-bold text-center">
        User Analytics
      </h1>
      <CustomChart />
      <h3 className="text-primary text-2xl font-bold text-center py-6">
        User polls
      </h3>
      <div className="w-full h-full flex gap-4 flex-col">
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
        <DashboardPollItemWithBlock />
      </div>
      <div className="w-full h-full flex justify-center">
        <Link href={"/dashboard/creators"}>
          <CommonButton
            style={{ padding: "10px 26px", borderRadius: "10px" }}
            className="text-primary"
          >
            view more
          </CommonButton>
        </Link>
      </div>
      <h3 className="text-primary text-2xl font-bold text-center py-6">
        User reports
      </h3>
      <div className="w-full h-full flex gap-4 flex-col">
        <DashboardUserReport />
        <DashboardUserReport />
        <DashboardUserReport />
        <DashboardUserReport />
        <DashboardUserReport />
        <DashboardUserReport />
        <DashboardUserReport />
      </div>
      <div className="w-full h-full flex justify-center">
        <Link href={"/dashboard/creators"}>
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
