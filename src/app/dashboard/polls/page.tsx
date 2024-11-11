"use client";
import CommonButton from "@/app/components/buttons/CommonButton";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomChart from "@/app/components/Chart/CustomChart";
import DashboardPollItemWithBlock from "@/app/components/dashboard/DashboardPollItemWithBlock";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import toast from "react-hot-toast";

const POLLS_PER_PAGE = 10;

function Page() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPolls = async (isInitial = false) => {
    try {
      setLoading(true);
      const pollsRef = collection(db, "polls");
      let q = query(
        pollsRef,
        orderBy("createdAt", "desc"),
        limit(POLLS_PER_PAGE)
      );

      if (!isInitial && lastDoc) {
        q = query(
          pollsRef,
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(POLLS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      const pollsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (isInitial) {
        setPolls(pollsData as Poll[]);
      } else {
        setPolls((prev) => [...prev, ...pollsData] as Poll[]);
      }

      setLastDoc(lastVisible);
      setHasMore(snapshot.docs.length === POLLS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls(true);
  }, []);

  if (loading && polls.length === 0) {
    return (
      <div className="w-full h-full grid place-items-center">Loading...</div>
    );
  }

  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-10">
      <h1 className="text-primary text-3xl font-bold">Polls</h1>
      <h3 className="text-primary text-2xl font-bold">List</h3>

      <div className="w-full h-full flex gap-4 flex-col">
        {polls.map((poll) => (
          <DashboardPollItemWithBlock key={poll.id} poll={poll} />
        ))}
      </div>

      {hasMore && (
        <div className="w-full h-full flex justify-center mt-4">
          <CommonButton
            style={{ padding: "10px 26px", borderRadius: "10px" }}
            className="text-primary"
            callback={() => fetchPolls(false)}
            loading={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </CommonButton>
        </div>
      )}
    </section>
  );
}

export default Page;
