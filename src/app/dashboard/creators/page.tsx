"use client";
import CommonButton from "@/app/components/buttons/CommonButton";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import CreatorsListItem from "./creatorsListItem";
import CustomChart from "@/app/components/Chart/CustomChart";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import toast from "react-hot-toast";
import SearchComponent from "@/app/components/common/SearchComponent";

interface Creator {
  uid: string;
  name: string;
  email: string;
  image: string | null;
  stats?: {
    totalPolls: number;
    totalViews: number;
    totalVotes: number;
  };
  isBlocked?: boolean;
}

interface ChartDataItem {
  [key: string]: string | number;
  name: string;
  value: number;
  views: number;
  votes: number;
}

function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("isAdmin", "==", false));
        const querySnapshot = await getDocs(q);
        
        const creatorsData = querySnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as Creator[];

        setCreators(creatorsData);

        // Prepare chart data
        const chartData = creatorsData.slice(0, 5).map(creator => ({
          name: creator.name,
          value: creator.stats?.totalPolls || 10,
          views: creator.stats?.totalViews || 9,
          votes: creator.stats?.totalVotes || 6,
        }));
        setChartData(chartData);

      } catch (error) {
        console.error("Error fetching creators:", error);
        toast.error("Failed to load creators");
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  const filteredCreators = creators.filter(creator => 
    creator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="w-full h-full grid place-items-center">Loading...</div>;
  }

  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-16 px-6">
      <div className="w-full h-full flex justify-between items-center">
        <h1 className="text-primary text-3xl font-bold">Creators</h1>
        <Link href="/dashboard/creators/reports">
          <CommonButton
            style={{ padding: "10px 26px", borderRadius: "10px" }}
            className="text-primary"
          >
            View Reports
          </CommonButton>
        </Link>
      </div>

      {/* Analytics Chart */}
      <div className="w-full h-[300px]">
        <CustomChart data={chartData} />
      </div>

      {/* Search and List Section */}
      <div className="w-full h-full flex flex-col md:flex-row justify-between gap-4 py-10">
        <h3 className="text-primary text-2xl font-bold">Creators List</h3>
        <SearchComponent
          placeholder="Search creators..."
        />
      </div>

      {/* Creators List */}
      {/* <div className="w-full h-full flex gap-4 flex-col">
        {filteredCreators.length === 0 ? (
          <div className="text-center text-gray-500">No creators found</div>
        ) : (
          filteredCreators.map((creator) => (
            <CreatorsListItem key={creator.uid} creator={creator} />
          ))
        )}
      </div> */}

      {/* View More Button */}
      {filteredCreators.length > 10 && (
        <div className="w-full h-full flex justify-center">
          <Link href="/dashboard/creators/all">
            <CommonButton
              style={{ padding: "10px 26px", borderRadius: "10px" }}
              className="text-primary"
            >
              View More
            </CommonButton>
          </Link>
        </div>
      )}
    </section>
  );
}

export default CreatorsPage;
