"use client";
import React, { useEffect, useState, useCallback } from "react";
import CustomChart from "../Chart/CustomChart";
import PollListItem from "../pages/poll-list2";
import { useAuth } from "@/app/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import toast from "react-hot-toast";
import CommonButton from "../buttons/CommonButton";
import Link from "next/link";

interface PollStats {
  totalViews: number;
  totalVotes: number;
  totalShares: number;
  pollsCount: number;
}

interface ChartData {
  name: string;
  value: number;
}

function MyPolls() {
  const { userData } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PollStats>({
    totalViews: 0,
    totalVotes: 0,
    totalShares: 0,
    pollsCount: 0,
  });

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    try {
      const pollsRef = collection(db, "polls");
      if (userData?.uid) {
        const q = query(pollsRef, where("createdBy", "==", userData?.uid));
        const querySnapshot = await getDocs(q);

        const fetchedPolls = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Poll[];

        setPolls(fetchedPolls);

        // Calculate stats
        const newStats = fetchedPolls.reduce(
          (acc, poll) => ({
            totalViews: acc.totalViews + (poll.views || 0),
            totalVotes:
              acc.totalVotes +
              poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0),
            totalShares: acc.totalShares + 0,
            pollsCount: fetchedPolls.length,
          }),
          {
            totalViews: 0,
            totalVotes: 0,
            totalShares: 0,
            pollsCount: 0,
          }
        );
        setStats(newStats);
      } else {
        toast.error("Please login to view your polls");
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error("Failed to load polls");
    } finally {
      setLoading(false);
    }
  }, [userData?.uid]);

  // Initial load
  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handlePollUpdated = async (pollId: string) => {
    // Refresh the polls list
    await fetchPolls();
  };

  const chartData: ChartData[] = [
    { name: "Total Views", value: stats.totalViews },
    { name: "Total Votes", value: stats.totalVotes },
    { name: "Total Shares", value: stats.totalShares },
  ];

  if (loading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 items-center py-10 p-5 max-w-7xl mx-auto">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary">My Polls</h3>
        <Link href="/polls/create">
          <CommonButton>Create New Poll</CommonButton>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Polls" value={stats.pollsCount} />
        <StatsCard title="Total Views" value={stats.totalViews} />
        <StatsCard title="Total Votes" value={stats.totalVotes} />
        <StatsCard title="Total Shares" value={stats.totalShares} />
      </div>

      {/* Chart */}
      <div className="w-full h-[400px]">
        <CustomChart data={chartData} />
      </div>

      {/* Polls List */}
      <div className="w-full flex flex-col gap-5">
        {polls.length > 0 ? (
          polls.map((poll) => (
            <PollListItem
              key={poll.id}
              poll={poll}
              onPollUpdated={handlePollUpdated}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>You haven't created any polls yet.</p>
            <Link href="/polls/create">
              <CommonButton>Create Your First Poll</CommonButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const StatsCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <h4 className="text-gray-600 text-sm">{title}</h4>
    <p className="text-primary text-2xl font-bold">{value.toLocaleString()}</p>
  </div>
);

export default MyPolls;
