"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface Ad {
  id: string;
  title: string;
  description: string;
  redirectLink: string;
  image: string;
  maxViews: number;
  currentViews: number;
  clicks: number;
  isActive: boolean;
  isBlocked: boolean;
  imageFillType: string;
}

function AdComponent() {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  const incrementViews = async (adId: string, currentViews: number) => {
    try {
      await updateDoc(doc(db, "ads", adId), {
        currentViews: currentViews + 1,
      });
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  const incrementClicks = async (adId: string, clicks: number) => {
    try {
      await updateDoc(doc(db, "ads", adId), {
        clicks: clicks + 1,
      });
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  const fetchRandomAd = async () => {
    try {
      setLoading(true);
      const adsRef = collection(db, "ads");

      // Get active and unblocked ads with remaining views
      let q = query(
        adsRef,
        where("isBlocked", "==", false),
        where("isActive", "==", true)
      );

      let querySnapshot = await getDocs(q);
      let availableAds = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Ad))
        .filter((ad) => ad.currentViews < ad.maxViews);

      // If no ads with remaining views, get any active unblocked ad
      if (availableAds.length === 0) {
        availableAds = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Ad)
        );
      }

      if (availableAds.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableAds.length);
        const selectedAd = availableAds[randomIndex];
        setCurrentAd(selectedAd);

        // Increment views when ad is displayed
        await incrementViews(selectedAd.id, selectedAd.currentViews);
      }
    } catch (error) {
      console.error("Error fetching ad:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomAd();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 border-2 border-slate-500 rounded-xl flex md:min-h-[50vh] min-h-[150px] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!currentAd) {
    return (
      <div className="flex-1 border-2 border-slate-500 rounded-xl flex md:min-h-[50vh] min-h-[150px] items-center justify-center">
        No ads available
      </div>
    );
  }

  return (
    <Link
      href={currentAd.redirectLink}
      target="_blank"
      onClick={() => incrementClicks(currentAd.id, currentAd.clicks)}
      className="flex-1 border-2 border-slate-500 rounded-xl 
   overflow-hidden relative group hover:border-primary 
   transition-colors flex justify-center items-center"
    >
      <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 z-50">
        <p>Ad </p>
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <p className="text-white text-lg font-semibold">Click to visit</p>
      </div>
      <div
        className={clsx(
          "relative w-full h-full",
          currentAd.imageFillType === "contain"
            ? "md:min-h-[50vh] min-h-[150px] "
            : "aspect-video"
        )}
      >
        <Image
          src={currentAd.image}
          alt={currentAd.title}
          fill
          className={
            currentAd.imageFillType === "contain"
              ? "object-contain w-full h-full"
              : "object-cover w-full h-full"
          }
          priority
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center p-4">
          <h3 className="text-white font-semibold text-lg text-center">
            {currentAd.title}
          </h3>
          {currentAd.description && (
            <p className="text-white/80 text-sm mt-2 text-center">
              {currentAd.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default AdComponent;
