"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import { FaEye, FaVoteYea } from "react-icons/fa";
import Link from "next/link";
import { getUser } from "@/app/utils/auth";
import CommonButton from "../buttons/CommonButton";

interface Poll {
  id: string;
  title: string;
  createdBy: string;
  public_link: string;
  views: number;
  isActive: boolean;
  options: Record<string, any>;
  totalVotes: number;
}

function TrendingPolls() {
  const [topVotedPolls, setTopVotedPolls] = useState<Poll[]>([]);
  const [mostViewedPolls, setMostViewedPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPolls = async () => {
      try {
        // Fetch all polls and sort by total votes
        const votesQuery = query(collection(db, "polls"), limit(50));

        // Fetch most viewed polls
        const viewsQuery = query(
          collection(db, "polls"),
          orderBy("views", "desc"),
          limit(10)
        );

        const [votesSnapshot, viewsSnapshot] = await Promise.all([
          getDocs(votesQuery),
          getDocs(viewsQuery),
        ]);

        const votedPollsPromise = votesSnapshot.docs
          .map((doc) => ({
            ...(doc.data() as Poll),
            id: doc.id,
          }))
          .map((poll) => ({
            ...poll,
            totalVotes: poll.options.reduce(
              (sum: number, option: any) => sum + (option.votes || 0),
              0
            ),
          }))
          .sort((a, b) => b.totalVotes - a.totalVotes)
          .slice(0, 10)
          .map(async (poll) => {
            const creator = await getUser(poll.createdBy);
            return {
              ...poll,
              createdBy: creator?.name,
            };
          });
        const votedPolls = await Promise.all(votedPollsPromise);
        const viewedPollsPromise = viewsSnapshot.docs
          .map((doc) => ({
            ...(doc.data() as Poll),
            id: doc.id,
          }))
          .map(async (poll) => {
            const creator = await getUser(poll.createdBy);
            return {
              ...poll,
              createdBy: creator?.name,
            };
          });
        const viewedPolls = await Promise.all(viewedPollsPromise);

        setTopVotedPolls(votedPolls);
        setMostViewedPolls(viewedPolls);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending polls:", error);
        setLoading(false);
      }
    };

    fetchTrendingPolls();
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center py-8">Loading trending polls...</div>
    );
  }

  const PollTable = ({
    polls,
    type,
  }: {
    polls: Poll[];
    type: "votes" | "views";
  }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Created By
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                {type === "votes" ? "Votes" : "Views"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {polls.map((poll) => (
              <tr
                key={poll.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/polls/${poll?.public_link}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {poll.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">{poll.createdBy}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    {type === "votes" ? (
                      <>
                        <FaVoteYea className="text-green-500" />{" "}
                        {poll.totalVotes}
                      </>
                    ) : (
                      <>
                        <FaEye className="text-blue-500" /> {poll.views || 0}
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      poll.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {poll.isActive ? "Active" : "Closed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaVoteYea className="text-green-500 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">Most Voted Polls</h2>
        </div>
        <PollTable polls={topVotedPolls} type="votes" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaEye className="text-blue-500 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            Most Viewed Polls
          </h2>
        </div>
        <PollTable polls={mostViewedPolls} type="views" />
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard/polls">
          <CommonButton>View All Polls</CommonButton>
        </Link>
      </div>
    </div>
  );
}

export default TrendingPolls;
