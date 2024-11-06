"use client";
import MyPolls from "@/app/components/polls/MyPolls";
import withAuth from "@/hoc/withAuth";
import React from "react";

function Page() {
  return (
    <div>
      <MyPolls />
    </div>
  );
}

export default withAuth(Page);
