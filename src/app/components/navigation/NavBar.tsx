"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Logo from "../common/logo";
import CommonButton from "../buttons/CommonButton";
import SearchComponent from "../common/SearchComponent";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import clsx from "clsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import { checkAdminAccess } from "@/app/utils/auth";

const NavBar: React.FC<{
  variant?: "default" | "polls" | "polls-create";
  isSearchable?: boolean;
  searchCallback?: () => void;
  menuItems?: {
    label: string;
    link: string;
    needAuth?: boolean;
  }[];
  isSticky?: boolean;
}> = ({
  variant = "default",
  isSearchable = true,
  searchCallback,
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
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { logout, userData } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!userData?.uid) {
        setIsAdmin(false);
        return;
      }
      const { isAuthorized } = await checkAdminAccess();
      setIsAdmin(isAuthorized);
    };

    checkAdmin();
  }, [userData?.uid]);

  const finalMenuItems = useMemo(() => {
    const baseItems = [...menuItems];

    if (isAdmin && userData?.uid) {
      baseItems.push({
        label: "Dashboard",
        link: "/dashboard",
        needAuth: true,
      });
    }

    return baseItems;
  }, [menuItems, isAdmin, userData?.uid]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      className={`p-4 md:p-10 md:py-3 m-0 w-full flex-1 ${
        isSticky ? "sticky top-0" : ""
      } bg-white z-50 `}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-black text-xl font-bold cursor-pointer">
            <Logo size="2xl" />
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/assets/icons/menu.svg"
              alt="menu"
              width={24}
              height={24}
            />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {finalMenuItems.length > 0 && (
            <div className="flex items-center gap-6">
              {finalMenuItems.map((item, index) => {
                const isActive = pathname === item.link;
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

          {/* User Profile Section */}
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
                  onClick={() =>
                    userData?.uid ? setIsMenuOpen(true) : router.push("/login")
                  }
                  className={clsx(
                    "w-[30px] h-[30px] rounded-full border border-gray-300 text-white grid place-items-center cursor-pointer",
                    userData?.name ? "bg-primary" : "bg-white"
                  )}
                >
                  {userData?.name ? (
                    userData.name[0].toUpperCase()
                  ) : (
                    <Image
                      src="/assets/icons/user.svg"
                      alt="user"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              )}

              {/* User Menu Dropdown */}
              <div
                className={`absolute right-0 z-10 mt-2 origin-top-right rounded-md
                   bg-white shadow-lg ring-1 ring-black ring-opacity-5
                    focus:outline-none ${isMenuOpen ? "block" : "hidden"}`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex={-1}
              >
                {userData?.name && (
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-gray-500 text-xs truncate">
                      {userData.email}
                    </p>
                  </div>
                )}
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

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center mb-8">
              <Logo size="2xl" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Image
                  src="/assets/icons/close.svg"
                  alt="close"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col gap-4">
              {finalMenuItems.map((item, index) => {
                const isActive = pathname === item.link;
                const isAuthenticated = userData?.uid;

                return item.needAuth && !isAuthenticated ? null : (
                  <Link
                    key={`mobile-item-${index}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {userData?.uid && (
                <Link
                  href="/polls/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4"
                >
                  <CommonButton style={{ width: "100%" }}>
                    Create Poll
                  </CommonButton>
                </Link>
              )}

              {userData?.uid ? (
                <>
                  <div className="border-t border-gray-200 my-4 pt-4">
                    <div className="flex items-center gap-3 px-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-white grid place-items-center">
                        {userData.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{userData.name}</p>
                        <p className="text-sm text-gray-500">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4"
                >
                  <CommonButton className="w-full">Login</CommonButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
