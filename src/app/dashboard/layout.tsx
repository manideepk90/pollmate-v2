import React from "react";
import NavBar from "../components/navigation/NavBar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col p-5 md:p-2">
      <NavBar />
      {children}
    </div>
  );
}

export default layout;
