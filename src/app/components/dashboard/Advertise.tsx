import React, { useEffect, useState } from "react";
import CommonButton from "../buttons/CommonButton";
import AdComponent from "../Ads/AdComponent";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";

interface AdStats {
  totalAds: number;
  totalViews: number;
  totalClicks: number;
}

function Advertise() {
  const [stats, setStats] = useState<AdStats>({
    totalAds: 0,
    totalViews: 0,
    totalClicks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdStats = async () => {
      try {
        const adsRef = collection(db, "ads");
        const querySnapshot = await getDocs(adsRef);
        
        let totalViews = 0;
        let totalClicks = 0;
        
        querySnapshot.forEach((doc) => {
          const ad = doc.data();
          totalViews += ad.currentViews || 0;
          totalClicks += ad.clicks || 0;
        });

        setStats({
          totalAds: querySnapshot.size,
          totalViews,
          totalClicks,
        });
      } catch (error) {
        console.error("Error fetching ad stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdStats();
  }, []);

  return (
    <section className="w-full h-full flex flex-col justify-center gap-6 bg-background p-6 pt-2 rounded-xl">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-primary text-3xl font-bold">Advertising</h1>
        <Link href="/dashboard/ads">
          <CommonButton
            style={{
              padding: "10px 26px",
              borderRadius: "10px",
              justifySelf: "flex-end",
              alignSelf: "flex-end",
            }}
            className="text-primary"
          >
            Manage Ads
          </CommonButton>
        </Link>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-primary text-xl font-semibold">Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm">Total Ads</p>
              <p className="text-2xl font-bold text-primary">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stats.totalAds.toLocaleString()
                )}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-primary">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stats.totalViews.toLocaleString()
                )}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-primary">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stats.totalClicks.toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Advertise;
