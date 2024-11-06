"use client";
import MyPollsPage from "@/app/components/polls/MyPollsPage";
import withAuth from "@/hoc/withAuth";
import React from "react";

function Page() {
  return (
    <div>
      <MyPollsPage />
    </div>
  );
}

export default withAuth(Page);
