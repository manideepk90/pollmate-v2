"use client";
import Tiles from "./tiles";
import TrendingPolls from "./TrendingPolls";
import Creators from "../dashboard/Creators";
import Advertise from "../dashboard/Advertise";

function DashboardPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center p-4 md:p-10 gap-8 md:gap-16">
      <Tiles />
      <Advertise />
      <TrendingPolls />
      <Creators />
    </main>
  );
}

export default DashboardPage;
