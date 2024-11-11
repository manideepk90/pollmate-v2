"use client";
import PollAnalytics from "@/app/components/polls/PollAnalytics";
import { getPoll } from "@/app/utils/polls";
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
        setPoll(pollData);
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
