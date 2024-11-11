import Link from "next/link";
import React, { useState } from "react";
import CommonButton from "../buttons/CommonButton";
import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import toast from "react-hot-toast";

interface AdProps {
  ad: {
    id: string;
    title: string;
    description: string;
    currentViews: number;
    maxViews: number;
    clicks: number;
    isBlocked: boolean;
  };
  onAdUpdated?: () => void;
}

function DashboardAdsItemWithBlock({ ad, onAdUpdated }: AdProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(ad.isBlocked);

  const handleBlockAd = async (adId: string, currentBlockStatus: boolean) => {
    try {
      setIsLoading(true);
      const adRef = doc(db, "ads", adId);
      await updateDoc(adRef, {
        isBlocked: !currentBlockStatus,
      });

      setIsBlocked(!currentBlockStatus);
      toast.success(
        `Ad ${currentBlockStatus ? "unblocked" : "blocked"} successfully`
      );

      // Call the callback if provided
      if (onAdUpdated) {
        onAdUpdated();
      }
    } catch (error) {
      console.error("Error updating ad status:", error);
      toast.error("Failed to update ad status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ background: "var(--linear)", borderRadius: "10px" }}
      className="w-full h-full border p-[1px]"
    >
      <div
        style={{
          borderRadius: "8px",
        }}
        className="w-full h-full flex gap-4 border-gray-200 bg-white p-3 items-center justify-between md:flex-nowrap flex-wrap"
      >
        <div className="">
          <Link href={`/dashboard/ads/${ad.id}`}>
            <h4 className="text-primary cursor-pointer font-bold text-2xl">
              {ad.title}
              {isBlocked && (
                <span className="text-sm text-red-500 ml-2">Blocked</span>
              )}
            </h4>
          </Link>
          <p className="text-sm text-gray-500">{ad.description}</p>
        </div>
        <div className="flex md:flex-col gap-2 items-end md:items-start">
          <p className="text-md text-primary text-end">
            {ad.currentViews}/{ad.maxViews} views
          </p>
          <p className="text-md text-primary text-end md:hidden">/</p>
          <p className="text-xl text-primary text-end">{ad.clicks} clicks</p>
        </div>
        <div className="flex gap-6 justify-center">
          <div className="flex md:flex-col flex-row gap-2 items-center justify-center">
            <Link href={`/dashboard/ads/${ad.id}`}>
              <CommonButton>View Ad</CommonButton>
            </Link>
            <CommonButton
              variant="outline"
              style={{
                color: isBlocked ? "green" : "red",
                borderColor: isBlocked ? "green" : "red",
              }}
              callback={() => handleBlockAd(ad.id, isBlocked)}
              loading={isLoading}
            >
              {isBlocked ? "Unblock Ad" : "Block Ad"}
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdsItemWithBlock;
