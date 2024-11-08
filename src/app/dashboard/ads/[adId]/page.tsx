import CommonButton from "@/app/components/buttons/CommonButton";
import CustomChart from "@/app/components/Chart/CustomChart";
import React from "react";

function page() {
  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-10 px-6">
      <h1 className="text-primary text-3xl font-bold text-center">
        Ad Analytics
      </h1>
      {/* <CustomChart data={[]} /> */}
      <h3 className="text-primary text-2xl font-bold text-center py-6">
        Ad result
      </h3>
      <div className="w-full h-full flex gap-4 flex-col p-10">
        <div className="w-full h-full flex gap-4 flex-col">
          <div className="w-full h-full flex gap-4 flex-col md:flex-row">
            <div className="w-full h-full flex gap-4 flex-col">
              <h3 className="text-primary text-2xl font-bold">Ad title</h3>
              <p className="text-primary text-md">10000/12000 views</p>
              <p className="text-primary text-md">11000/13000 clicks</p>
              <p className="text-primary text-md">visible to users</p>
            </div>
            <div>
              <div className="w-full h-full ">Ad Image</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full flex gap-4 justify-center">
        <CommonButton
          style={{ padding: "10px 26px", borderRadius: "10px" }}
          className="text-primary"
        >
          Increase Ad limit
        </CommonButton>
        {/* <Link href={"/dashboard/creators"}> */}
        <CommonButton
          style={{ padding: "10px 26px", borderRadius: "10px" }}
          className="text-primary"
        >
          Download CSV
        </CommonButton>
        {/* </Link> */}
      </div>
    </section>
  );
}

export default page;
