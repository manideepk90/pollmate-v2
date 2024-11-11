"use client";
import CommonButton from "@/app/components/buttons/CommonButton";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import CreatorsListItem from "./creatorsListItem";
import CustomChart from "@/app/components/Chart/CustomChart";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import toast, { Toaster } from "react-hot-toast";
import SearchComponent from "@/app/components/common/SearchComponent";

interface Creator {
  name: string;
  email: string;
  reports?: number;
  pollsCount?: number;
  pollViews?: number;
  id?: string;
  image?: string;
  category?: string;
}

interface ChartDataItem {
  [key: string]: string | number;
  name: string;
  value: number;
}
const userLimit = 10;
const viewLimit = 5;

function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chartPollData, setChartPollData] = useState<ChartDataItem[]>([]);
  const [chartVoteData, setChartVoteData] = useState<ChartDataItem[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);

  useEffect(() => {
    const fetchCreatorsAnalytics = async () => {
      try {
        setLoading(true);
        const pollsRef = collection(db, "polls");
        const pollsQuery = query(
          pollsRef,
          orderBy("views", "desc"),
          limit(viewLimit)
        );
        const pollsSnapshot = await getDocs(pollsQuery);

        const fetchedPolls = pollsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { createdBy: string }),
        }));
        let chartPollData: ChartDataItem[] = [];
        let chartVotesData: ChartDataItem[] = [];
        const pollPromises = fetchedPolls.map(async (poll: any) => {
          const userRef = doc(db, "users", poll.createdBy);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          let creator: Creator = {
            name: userData?.name,
            email: userData?.email,
          };

          chartPollData.push({
            name: creator.name,
            value: poll.views,
          });
          chartVotesData.push({
            name: creator.name,
            value: poll.options.reduce((acc: number, option: any) => {
              return acc + option.votes;
            }, 0),
          });
        });

        await Promise.all(pollPromises);
        setChartPollData(chartPollData);
        setChartVoteData(chartVotesData);
      } catch (error) {
        console.error("Error fetching creators:", error);
        toast.error("Failed to load creators");
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorsAnalytics();
  }, []);

  const handleLoadMore = async () => {
    fetchUsers();
  };
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const usersRef = collection(db, "users");
      let queries = [];

      if (searchQuery.trim()) {
        // If there's a search query, search by name and email
        const searchLower = searchQuery.toLowerCase();
        queries.push(
          query(
            usersRef,
            where("name", ">=", searchLower),
            where("name", "<=", searchLower + "\uf8ff"),
            limit(userLimit)
          ),
          query(
            usersRef,
            where("email", ">=", searchLower),
            where("email", "<=", searchLower + "\uf8ff"),
            limit(userLimit)
          )
        );
      } else {
        // If no search query, fetch only 10 users
        if (lastDoc) {
          queries.push(query(usersRef, limit(userLimit), startAfter(lastDoc)));
        } else {
          queries.push(query(usersRef, limit(userLimit)));
        }
      }

      const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
      const usersSnapshot = {
        docs: snapshots.flatMap((snapshot) => snapshot.docs),
      };

      const fetchedCreators: Creator[] = [];
      const uniqueCategories = new Set<string>(["All"]);
      const lastVisible = usersSnapshot.docs[usersSnapshot.docs.length - 1];
      setLastDoc(() => lastVisible);

      const pollPromises = usersSnapshot.docs.map(async (doc) => {
        const userData = doc.data();
        if (userData.category) {
          uniqueCategories.add(userData.category);
        }
        const pollsRef = collection(db, "polls");
        const q = query(pollsRef, where("createdBy", "==", doc.id));
        const pollsSnapshot = await getDocs(q);
        const pollCount = pollsSnapshot.docs.length;
        const pollViews = pollsSnapshot.docs.reduce(
          (acc: number, poll: any) => acc + poll.data().views,
          0
        );

        fetchedCreators.push({
          id: doc.id,
          name: userData.name || "Anonymous",
          email: userData.email || "No email provided",
          image: userData.image || "/assets/icons/user.svg",
          category: userData.category || "Uncategorized",
          pollsCount: pollCount || 0,
          pollViews: pollViews || 0,
        });
      });

      await Promise.all(pollPromises);
      setCategories(Array.from(uniqueCategories));
      if (searchQuery.trim()) {
        setCreators(
          fetchedCreators
            .reduce((acc, current) => {
              if (!acc.find((item) => item.id === current.id)) {
                acc.push(current);
              }
              return acc;
            }, [] as Creator[])
            .sort((a, b) => (b.pollViews || 0) - (a.pollViews || 0))
        );
      } else {
        setCreators((prev) => {
          const combined = [...prev, ...fetchedCreators];
          const uniqueCreators = combined.reduce((acc, current) => {
            if (!acc.find((item) => item.id === current.id)) {
              acc.push(current);
            }
            return acc;
          }, [] as Creator[]);

          return uniqueCreators.sort(
            (a, b) => (b.pollViews || 0) - (a.pollViews || 0)
          );
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    setLastDoc(null);
  }, [searchQuery]);

  const filteredCreators = creators.filter(
    (creator) =>
      creator.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-full grid place-items-center">Loading...</div>
    );
  }

  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-16 px-6">
      <Toaster />
      <div className="w-full h-full flex justify-between items-center">
        <h1 className="text-primary text-3xl font-bold">Creators</h1>
        {/* <Link href="/dashboard/creators/reports">
          <CommonButton
            style={{ padding: "10px 26px", borderRadius: "10px" }}
            className="text-primary"
          >
            View Reports
          </CommonButton>
        </Link> */}
      </div>

      {/* Analytics Chart */}
      <div className="w-full flex flex-col gap-6">
        <h3 className="text-primary text-2xl font-bold">Top 5 Poll Views</h3>
        <div className="w-full h-[330px]">
          <CustomChart data={chartPollData} />
        </div>
        <h3 className="text-primary text-2xl font-bold">Top 5 Poll Votes</h3>
        <div className="w-full h-[330px]">
          <CustomChart data={chartVoteData} />
        </div>
      </div>

      {/* Search and List Section */}
      <div className="w-full h-full flex flex-col md:flex-row  justify-between gap-4 py-10">
        <h3 className="text-primary text-2xl font-bold flex flex-col gap-2">
          <span>Creators List</span>
          <span className="text-sm text-gray-500">
            View all creators and their analytics
          </span>
        </h3>
        <div className="flex flex-1 gap-4 items-center md:justify-end">
          <SearchComponent
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators..."
          />
          <div className=" flex gap-4">
            {categories.map((category) => (
              <CommonButton key={category}>{category}</CommonButton>
            ))}
          </div>
        </div>
      </div>

      {/* Creators List */}
      <div className="w-full h-full flex gap-4 flex-col">
        {filteredCreators.length === 0 ? (
          <div className="text-center text-gray-500">No creators found</div>
        ) : (
          filteredCreators.map((creator) => (
            <CreatorsListItem key={creator.id} creator={creator} />
          ))
        )}
      </div>

      {/* View More Button */}
      {!isLoading && filteredCreators.length >= userLimit && lastDoc && (
        <div className="w-full h-full flex justify-center">
          <CommonButton
            style={{ padding: "10px 26px", borderRadius: "10px" }}
            className="text-primary"
            callback={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View More"}
          </CommonButton>
        </div>
      )}
      {isLoading && (
        <div className="w-full h-full flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </section>
  );
}

export default CreatorsPage;
