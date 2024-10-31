import React from "react";
import DashboardUserItem from "./DashboardUserItem";
import CommonButton from "../buttons/CommonButton";
import Link from "next/link";

function Creators() {
  return (
    <section className="w-full h-full flex flex-col justify-center gap-4">
      <h1 className="text-primary text-3xl font-bold">Creators</h1>
      <div className="w-full h-full flex gap-4 flex-wrap">
        <DashboardUserItem />
        <DashboardUserItem />
        <DashboardUserItem />
        <DashboardUserItem />
        <DashboardUserItem />
        <DashboardUserItem />
        <DashboardUserItem />
        <DashboardUserItem />
        <DashboardUserItem />
        <DashboardUserItem />
      </div>
      <div className="w-full h-full flex justify-center">
        <Link href={"/dashboard/creators"}>
          <CommonButton
            style={{ padding: "10px 26px", borderRadius: "10px" }}
            className="text-primary"
          >
            Explore creators
          </CommonButton>
        </Link>
      </div>
    </section>
  );
}

export default Creators;
