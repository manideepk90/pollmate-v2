"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PollOptionItem from "./PollOption";
import CommonButton from "../buttons/CommonButton";
import { formatDate } from "@/app/utils/dateUtils";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getPoll, votePoll, updatePollViews } from "@/app/utils/polls";
import { getLocalStorage, setLocalStorage } from "@/app/utils/localStorage";
import toast, { Toaster } from "react-hot-toast";

function PollDetails() {
  const { id: link } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [hasViewed, setHasViewed] = useState(false);
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await getPoll(link as string);
        setPoll(pollData);

        // Check if user has viewed this poll before
        const viewKey = `poll_view_${link}`;
        const hasViewedBefore = getLocalStorage(viewKey);

        if (!hasViewedBefore) {
          // Update view count in Firestore
          await updatePollViews(link as string);
          // Mark as viewed in localStorage
          setLocalStorage(viewKey, "true");
          setHasViewed(true);
        }
      } catch (error) {
        // toast.error("No poll found");
        // setTimeout(() => {
        //   router.push("/404");
        // }, 1000);
      }
    };

    fetchPoll();
  }, [link]);

  useEffect(() => {
    const voteKey = `poll_vote_${link}`;
    const previousVote = getLocalStorage(voteKey);
    if (previousVote) {
      setVoted(JSON.parse(previousVote).value);
    }
  }, [link]);

  const handleVote = async (value: string) => {
    try {
      const voteKey = `poll_vote_${link}`;
      const previousVote = getLocalStorage(voteKey);

      if (previousVote && JSON.parse(previousVote).value === value) {
        toast.error("You have already voted for this option");
        return;
      }

      toast.loading("Submitting vote...");
      const result = await votePoll(
        poll?.public_link as string,
        value,
        previousVote ? JSON.parse(previousVote).value : null
      );

      if (result) {
        setPoll(result as Poll);
        toast.dismiss();
        toast.success("Vote submitted successfully");

        // Store vote in localStorage
        setLocalStorage(
          voteKey,
          JSON.stringify({
            value,
            timestamp: new Date().getTime(),
          })
        );
        setVoted(value);
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.dismiss();
      toast.error("Failed to submit vote");
    }
  };

  return (
    <div
      style={{
        minWidth: "200px",
      }}
      className="flex-1 flex flex-col gap-5 items-center p-6"
    >
      <Toaster />
      <div className="flex items-center justify-center w-full gap-5">
        <h2 className="text-3xl text-center font-bold text-primary">
          {poll?.title}
        </h2>
      </div>

      <p className="text-md text-slate-500 text-center">{poll?.description}</p>
      <div className="flex items-center justify-center w-full gap-5 p-2">
        <Image
          src={"/assets/icons/share.svg"}
          alt="poll"
          width={24}
          height={24}
        />
        <Image
          src={"/assets/icons/report.svg"}
          alt="poll"
          width={24}
          height={24}
        />
      </div>
      <div className="flex items-center justify-center w-full h-56 gap-5 relative border overflow-hidden border-slate-500 rounded-xl">
        <Image
          src={"/assets/dummy-placeholder.png"}
          alt="poll"
          title="poll"
          fill
          style={{
            objectFit: "contain",
            top: 0,
            left: 0,
          }}
        />
      </div>
      <div className="flex items-center justify-center w-full gap-5">
        {poll?.updatedAt ? (
          <p className="text-sm text-slate-500">
            Updated at {formatDate(poll.updatedAt) || "N/A"}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Created at {formatDate(poll?.createdAt || "") || "N/A"}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-5">
        {poll &&
          poll?.options &&
          poll?.options?.length > 0 &&
          poll?.options.map((option, index) => (
            <PollOptionItem
              key={index}
              option={option}
              active={option.value === voted}
              callback={handleVote}
            />
          ))}
      </div>
      <div className="flex items-center justify-center w-full gap-5">
        <h6 className="text-primary text-xl font-bold">Total votes</h6>
        <p className="text-primary text-xl font-bold">
          {poll && poll?.options && poll?.options?.length > 0
            ? poll?.options.reduce((acc, curr) => acc + curr.votes, 0)
            : 0}
        </p>
      </div>
      <div className="flex items-center justify-center w-full gap-5">
        <CommonButton>Refer people</CommonButton>
      </div>
    </div>
  );
}

export default PollDetails;
