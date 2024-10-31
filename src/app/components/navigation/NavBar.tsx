"use client";
import React from "react";
import Logo from "../common/logo";
import CommonButton from "../buttons/CommonButton";
import SearchComponent from "../common/SearchComponent";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const NavBar: React.FC<{
  variant?: "default" | "polls" | "polls-create";
  isSearchable?: false;
  searchCallback?: () => {};
  menuItems?: {
    label: string;
    link: string;
  }[];
  isSticky?: boolean;
}> = ({
  variant = "default",
  isSearchable = true,
  searchCallback = null,
  menuItems = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "My polls",
      link: "/polls/my-polls",
    },
  ],
  isSticky = true,
}) => {
  return (
    <nav
      className={`p-10 py-3 m-0  w-full flex-1 ${
        isSticky ? "sticky top-0" : ""
      } bg-white z-50`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className=" text-black text-xl font-bold cursor-pointer">
            <Logo size="2xl" />
          </h1>
        </Link>
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
                  key={`item-${index}`}
                  className="cursor-pointer menu-item"
                  data-active={usePathname() === item.link}
                >
                  <Link href={item.link}>{item.label}</Link>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4">
            <Link href="/polls/create">
              <CommonButton>Create Poll</CommonButton>
            </Link>
            {/* <Link href="/auth/login">
               <div className="text-primary font-bold rounded-full border w-20 h-10 flex justify-center items-center">
                Login
              </div> 
            </Link> */}
            <div className="cursor-pointer">
              <Image
                src="/assets/icons/user.svg"
                alt="user"
                width={30}
                height={30}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
