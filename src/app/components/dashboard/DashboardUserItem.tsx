import Link from "next/link";
import React from "react";

function DashboardUserItem() {
  return (
    <div
      style={{ background: "var(--linear)", borderRadius: "10px" }}
      className="w-full md:w-[48%] h-full border p-[1px]"
    >
      <div
        style={{
          borderRadius: "8px",
        }}
        className="w-full h-full flex gap-4  border-gray-200 bg-white p-3 items-center justify-between"
      >
        <div className="flex-1">
          <Link href={`/dashboard/creators/${"123"}`}>
            <h4 className="text-primary cursor-pointer font-bold text-2xl">
              User name 
              {/* <span className="text-sm text-red-500">10 reports</span> */}
            </h4>
          </Link>
          <p className="text-sm text-gray-500">user@email.com</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-md text-primary text-end">10000 polls</p>
          <p className="text-xl text-primary text-end">11000 poll views</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardUserItem;
