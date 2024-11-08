"use client";
import CommonButton from "@/app/components/buttons/CommonButton";
import Link from "next/link";
import React from "react";
import CustomChart from "@/app/components/Chart/CustomChart";
import DashboardAdsItemWithBlock from "@/app/components/dashboard/AdsItem";
import SearchComponent from "@/app/components/common/SearchComponent";

function page() {
  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-16 px-6">
      <div className="w-full h-full flex justify-between">
        <h1 className="text-primary text-3xl font-bold">Ads</h1>
        <CommonButton
          style={{
            padding: "10px 26px",
            borderRadius: "10px",
            justifySelf: "flex-end",
            alignSelf: "flex-end",
          }}
          className="text-primary"
        >
          Create Ad
        </CommonButton>
      </div>
      {/* <CustomChart data={[]} /> */}
      <div className="w-full h-full flex flex-col md:flex-row justify-between gap-4 py-10">
        <h3 className="text-primary text-2xl font-bold">list</h3>
        {/* <SearchComponent />  */}
      </div>
      <div className="w-full h-full flex gap-4 flex-col">
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
        <DashboardAdsItemWithBlock />
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
