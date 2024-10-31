import React from "react";
import NavBar from "../components/navigation/NavBar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-svh">
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Layout;
