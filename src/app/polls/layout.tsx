import React from "react";
import NavBar from "../components/navigation/NavBar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <NavBar />
      {children}
    </div>
  );
}

export default Layout;
