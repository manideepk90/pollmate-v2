"use client";
import React from "react";
import NavBar from "../components/navigation/NavBar";
import withAdminAuth from "@/hoc/withAdminAuth";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col p-5 md:p-2">
      <NavBar />
      {children}
    </div>
  );
}

export default withAdminAuth(Layout as React.ComponentType);
