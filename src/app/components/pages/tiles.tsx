"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";

function Tiles() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPolls: 0,
    totalVotes: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const pollsSnapshot = await getDocs(collection(db, "polls"));

        let totalVotes = 0;
        let totalViews = 0;
        pollsSnapshot.forEach((doc) => {
          const pollData = doc.data();
          if (pollData.options) {
            totalVotes += pollData.options.reduce(
              (sum: number, option: any) => {
                return sum + (option.votes || 0);
              },
              0
            );
          }
          totalViews += pollData.views || 0;
        });

        setStats({
          totalUsers: usersSnapshot.size || 0,
          totalPolls: pollsSnapshot.size || 0,
          totalVotes: totalVotes || 0,
          totalViews: totalViews || 0,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="w-full text-center">Loading statistics...</div>;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200">
        <h2 className="text-lg font-semibold mb-2 text-blue-900">
          Total Users
        </h2>
        <p className="text-4xl font-bold text-blue-600">
          {stats.totalUsers.toLocaleString()}
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-200">
        <h2 className="text-lg font-semibold mb-2 text-purple-900">
          Total Polls
        </h2>
        <p className="text-4xl font-bold text-purple-600">
          {stats.totalPolls.toLocaleString()}
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-200">
        <h2 className="text-lg font-semibold mb-2 text-green-900">
          Total Votes
        </h2>
        <p className="text-4xl font-bold text-green-600">
          {stats.totalVotes.toLocaleString()}
        </p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-orange-200">
        <h2 className="text-lg font-semibold mb-2 text-orange-900">
          Total Views
        </h2>
        <p className="text-4xl font-bold text-orange-600">
          {stats.totalViews.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default Tiles;
