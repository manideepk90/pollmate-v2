import Image from "next/image";
import React from "react";
import CardItem from "../dashboard/CardItem";
import Tiles from "./tiles";
import TrendingPolls from "./TrendingPolls";
import Creators from "../dashboard/Creators";

function DashboardPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center p-10 gap-16">
      <Tiles />
      <TrendingPolls />
      <Creators />
    </main>
  );
}

export default DashboardPage;
