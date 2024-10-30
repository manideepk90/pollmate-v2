"use client";
import React, { useState } from "react";
import Logo from "../common/logo";
import CommonButton from "../buttons/CommonButton";
import SearchComponent from "../common/SearchComponent";

const NavBar: React.FC<{
  variant?: "default" | "polls" | "polls-create";
  isSearchable?: false;
  searchCallback?: () => {};
  menuItems?: {
    label: string;
    callback?: () => void;
  }[];
}> = ({
  variant = "default",
  isSearchable = true,
  searchCallback = null,
  menuItems = [
    {
      label: "Home",
    },
    {
      label: "My polls",
    },
  ],
}) => {
  return (
    <nav className="p-10 py-3 w-full flex-1">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className=" text-black text-xl font-bold">
          <Logo size="2xl" />
        </h1>
        <div className="flex items-center gap-10">
          {isSearchable && (
            <div>
              <SearchComponent />
            </div>
          )}
          {menuItems.length > 0 && (
            <div className="flex items-center gap-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="cursor-pointer menu-item"
                  data-active={false}
                  onClick={item.callback}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4">
            <CommonButton callback={() => {}}>Create Poll</CommonButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
