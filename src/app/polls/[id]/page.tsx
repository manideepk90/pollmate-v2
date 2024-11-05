"use client";
import AdComponent from "@/app/components/Ads/AdComponent";
import PollList from "@/app/components/pages/poll-list";
import PollPage from "@/app/components/polls/PollPage";
import React, { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/dist/client/components/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";

function Page() {
  const { id: link } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchPoll = async () => {
      const pollsRef = collection(db, "polls");
      const q = query(pollsRef, where("public_link", "==", link));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const pollData = querySnapshot.docs[0].data() as Poll;
        setPoll(pollData);
      } else {
        router.push("/404");
      }
    };

    fetchPoll();
  }, [link]);

  return (
    <div className="flex flex-col gap-10 mb-20">
      <div className="min-w-full min-h-full flex gap-5 md:flex-row flex-col md:p-5 p-2 ">
        <AdComponent />

        <PollPage poll={poll} />
        <AdComponent />
      </div>
      <div className="flex flex-col gap-10 justify-center items-center">
        <h6 className="text-primary text-2xl font-bold">Discover more polls</h6>
        <PollList />
      </div>
    </div>
  );
}

export default Page;
