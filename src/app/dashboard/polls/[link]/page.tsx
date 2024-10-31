import CommonButton from "@/app/components/buttons/CommonButton";
import CustomChart from "@/app/components/Chart/CustomChart";
import React from "react";

function page() {
  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-10 px-6">
      <h1 className="text-primary text-3xl font-bold text-center">
        Poll Analytics
      </h1>
      <CustomChart />
      <h3 className="text-primary text-2xl font-bold text-center py-6">
        Poll result
      </h3>
      <div className="w-full h-full flex gap-4 flex-col">
        <div className="w-full h-full flex gap-4 flex-col">
          <div className="w-full h-full flex gap-4 flex-col md:flex-row">
            <div className="w-full h-full flex gap-4 flex-col">
              <h3 className="text-primary text-2xl font-bold">poll title</h3>
              <p className="text-primary text-md">10000 polls</p>
              <p className="text-primary text-md">11000 poll views</p>
              <p className="text-primary text-md">1000 shares</p>
            </div>
            <div>
              <div className="w-full h-full ">Poll Image</div>
            </div>
          </div>
          <div className="w-full h-full flex gap-4 flex-col">
            <table className="text-primary text-xl border border-collapse">
              <thead>
                <tr>
                  <th className="border">top</th>
                  <th className="border">option</th>
                  <th className="border">votes</th>
                  <th className="border">percentage</th>
                </tr>
              </thead>
              <tbody className="text-primary text-center">
                <tr>
                  <td className="border">1</td>
                  <td className="border">option 1</td>
                  <td className="border">1000</td>
                  <td className="border">10%</td>
                </tr>
                <tr>
                  <td className="border">2</td>
                  <td className="border">option 2</td>
                  <td className="border">900</td>
                  <td className="border">9%</td>
                </tr>
                <tr>
                  <td className="border">3</td>
                  <td className="border">option 3</td>
                  <td className="border">800</td>
                  <td className="border">8%</td>
                </tr>
                <tr className="text-primary text-2xl">
                  <td className="border"></td>
                  <td className="border">Total</td>
                  <td className="border">3700</td>
                  <td className="border">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full h-full flex justify-center">
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
