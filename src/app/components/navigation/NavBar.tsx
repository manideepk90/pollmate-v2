"use client";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../common/logo";
import CommonButton from "../buttons/CommonButton";
import SearchComponent from "../common/SearchComponent";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

const NavBar: React.FC<{
  variant?: "default" | "polls" | "polls-create";
  isSearchable?: false;
  searchCallback?: () => {};
  menuItems?: {
    label: string;
    link: string;
    needAuth?: boolean;
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
      needAuth: true,
    },
  ],
  isSticky = true,
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { logout, userData } = useAuth();
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
              {menuItems.map((item, index) => {
                const isActive = usePathname() === item.link;
                const isAuthenticated = userData?.uid;

                return (
                  <div
                    key={`item-${index}`}
                    className="cursor-pointer menu-item"
                    data-active={isActive}
                  >
                    {item.needAuth && !isAuthenticated ? null : (
                      <Link href={item.link}>{item.label}</Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex items-center gap-4">
            {userData?.uid && (
              <Link href="/polls/create">
                <CommonButton>Create Poll</CommonButton>
              </Link>
            )}
            <div className="cursor-pointer relative" ref={menuRef}>
              {userData?.image ? (
                <Image
                  src={userData.image}
                  alt={userData.name || "user"}
                  onClick={() => setIsMenuOpen(true)}
                  width={30}
                  height={30}
                  className="rounded-full object-cover"
                />
              ) : (
                <div
                  onClick={() => userData?.uid ? setIsMenuOpen(true) : router.push("/login")}
                  className="w-[30px] h-[30px] rounded-full bg-primary text-white grid place-items-center cursor-pointer"
                >
                  {userData?.name ? userData.name[0].toUpperCase() : (
                    <Image
                      src="/assets/icons/user.svg"
                      alt="user"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              )}
              
              <div
                className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                  isMenuOpen ? "block" : "hidden"
                }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex={-1}
              >
                {/* User name section */}
                {userData?.name && (
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-gray-500 text-xs truncate">{userData.email}</p>
                  </div>
                )}
                
                {/* Logout button */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  role="menuitem"
                  tabIndex={-1}
                  id="user-menu-item-0"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
