"use client";
import Tiles from "./tiles";
import TrendingPolls from "./TrendingPolls";
import Creators from "../dashboard/Creators";
import withAdminAuth from "@/hoc/withAdminAuth";

function DashboardPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center p-4 md:p-10 gap-8 md:gap-16">
      <Tiles />
      <TrendingPolls />
      <Creators />
    </main>
  );
}

export default withAdminAuth(DashboardPage);
