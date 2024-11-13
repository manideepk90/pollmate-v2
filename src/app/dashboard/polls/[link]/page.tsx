"use client";
import PollAnalytics from "@/app/components/polls/PollAnalytics";
import { getPoll } from "@/app/utils/polls";
import { collection, query, where } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function PollPage() {
  const link = useParams()?.link as string;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        if (!link) return;
        const pollData = await getPoll(link as string);
        if (!pollData) return;
        const sharedReportsRef = collection(db, "sharedReports");
        const q = query(sharedReportsRef, where("pollId", "==", pollData?.uid));
        const querySnapshot = await getDocs(q);
        const totalShares = querySnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().shareCount || 0),
          0
        );
        setPoll({ ...pollData, totalShares });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [link]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (!poll) {
    return <div>Poll not found</div>;
  }

  return <PollAnalytics poll={poll} />;
}

export default PollPage;
