"use client";

import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/initFirebase";
import CommonButton from "@/app/components/buttons/CommonButton";
import Image from "next/image";
import { FaUserLock } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function BlockedPage() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <FaUserLock className="text-red-600 text-6xl mx-auto" />
          <h2 className="mt-6 text-3xl font-bold text-red-600">
            Account Blocked
          </h2>
          <p className="mt-2 text-gray-600">
            Your account has been blocked due to violation of our terms of
            service or community guidelines.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <p className="text-sm text-gray-500">
              If you believe this is a mistake or would like to appeal this
              decision, please contact our support team:
            </p>
            <a
              href="mailto:pollmate4u@gmail.com"
              className="text-primary hover:underline block"
            >
              pollmate4u@gmail.com
            </a>
          </div>

          <CommonButton
            callback={handleSignOut}
            className="w-full"
            variant="outline"
          >
            Sign Out
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
