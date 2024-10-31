import Link from "next/link";
import CommonButton from "../buttons/CommonButton";
import React from "react";
import Image from "next/image";

function DashboardAdsItemWithBlock() {
  return (
    <div
      style={{ background: "var(--linear)", borderRadius: "10px" }}
      className="w-full h-full border p-[1px]"
    >
      <div
        style={{
          borderRadius: "8px",
        }}
        className="w-full h-full flex gap-4 border-gray-200 bg-white p-3 items-center justify-between md:flex-nowrap flex-wrap"
      >
        <div className="">
          <Link href={`/dashboard/polls/${"123"}`}>
            <h4 className="text-primary cursor-pointer font-bold text-2xl">
              Ads title
              {"  "}
              <span className="text-sm text-red-500">10 reports</span>
            </h4>
          </Link>
          <p className="text-sm text-gray-500">Ads description</p>
        </div>
        <div className="flex md:flex-col gap-2 items-end md:items-start">
          <p className="text-md text-primary text-end">10000/10000 views</p>
          <p className="text-md text-primary text-end md:hidden">/</p>
          <p className="text-xl text-primary text-end">11000/110000 clicks</p>
        </div>
        <div className="flex gap-6 justify-center">
          <div className="flex md:flex-col flex-row gap-2 items-center justify-center">
            <Link href={`/dashboard/ads/${"123"}`}>
              <CommonButton>View Ad</CommonButton>
            </Link>
            <CommonButton
              variant="outline"
              style={{
                color: "red",
                borderColor: "red",
              }}
            >
              block Ad
            </CommonButton>
          </div>
          <div className=" flex md:justify-end justify-between flex-row gap-4">
            <Image
              src="/assets/icons/share.svg"
              alt="share"
              width={20}
              height={20}
            />
            {/* <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            /> */}
            <Image
              src="/assets/icons/download.svg"
              alt="download"
              width={20}
              height={20}
            />
            {/* <Image
              src="/assets/icons/delete.svg"
              alt="delete"
              width={20}
              height={20}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdsItemWithBlock;
