"use client";
import CommonButton from "@/app/components/buttons/CommonButton";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import CustomChart from "@/app/components/Chart/CustomChart";
import DashboardAdsItemWithBlock from "@/app/components/dashboard/AdsItem";
import SearchComponent from "@/app/components/common/SearchComponent";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import toast, { Toaster } from "react-hot-toast";

interface AdStats {
  totalViews: number;
  totalClicks: number;
  totalAds: number;
}

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
  createdAt: string;
}

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdStats>({
    totalViews: 0,
    totalClicks: 0,
    totalAds: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const adsRef = collection(db, "ads");
      const q = query(adsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedAds = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ad[];

      // Calculate stats
      const calculatedStats = fetchedAds.reduce(
        (acc, ad) => {
          acc.totalViews += ad.currentViews || 0;
          acc.totalClicks += ad.clicks || 0;
          acc.totalAds += 1;
          return acc;
        },
        { totalViews: 0, totalClicks: 0, totalAds: 0 }
      );

      setStats(calculatedStats);
      setAds(fetchedAds);
    } catch (error) {
      console.error("Error fetching ads:", error);
      toast.error("Failed to load ads statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = [
    { name: "Views", value: stats.totalViews },
    { name: "Clicks", value: stats.totalClicks },
  ];

  if (loading && ads.length === 0) {
    return (
      <div className="w-full h-full grid place-items-center">Loading...</div>
    );
  }

  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-16 px-6">
      <Toaster />
      {/* Header Section */}
      <div className="w-full h-full flex justify-between items-center">
        <h1 className="text-primary text-3xl font-bold">Ads Management</h1>
        <Link href="/dashboard/ads/create">
          <CommonButton
            style={{
              padding: "10px 26px",
              borderRadius: "10px",
            }}
            className="text-primary"
          >
            Create Ad
          </CommonButton>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600 text-sm">Total Ads</p>
          <p className="text-2xl font-bold text-primary">
            {stats.totalAds.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600 text-sm">Total Views</p>
          <p className="text-2xl font-bold text-primary">
            {stats.totalViews.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600 text-sm">Total Clicks</p>
          <p className="text-2xl font-bold text-primary">
            {stats.totalClicks.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full min-h-[300px] bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <CustomChart data={chartData} />
      </div>

      {/* Search and List Section */}
      <div className="w-full flex flex-col md:flex-row justify-between gap-4 py-10">
        <h3 className="text-primary text-2xl font-bold">Active Ads</h3>
        <SearchComponent
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ads..."
        />
      </div>

      {/* Ads List */}
      <div className="w-full flex gap-4 flex-col">
        {filteredAds.length === 0 ? (
          <div className="text-center text-gray-500">No ads found</div>
        ) : (
          filteredAds.map((ad) => (
            <DashboardAdsItemWithBlock key={ad.id} ad={ad} />
          ))
        )}
      </div>
    </section>
  );
}

export default Page;
